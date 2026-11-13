var A={title:"add-trailing-comma",repository:"https://github.com/asottile/add-trailing-comma",commit:"73c775a66303f25cbf03b0c2e3c14e71253f198a",sourceRoot:"",license:"MIT",files:{"add_trailing_comma/__init__.py":"","add_trailing_comma/__main__.py":`from __future__ import annotations

from add_trailing_comma._main import main

if __name__ == '__main__':
    raise SystemExit(main())
`,"add_trailing_comma/_ast_helpers.py":`from __future__ import annotations

import ast
import warnings
from typing import Protocol

from tokenize_rt import Offset


def ast_parse(contents_text: str) -> ast.Module:
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        return ast.parse(contents_text.encode())


class _HasOffsetInfo(Protocol):
    @property
    def lineno(self) -> int: ...
    @property
    def col_offset(self) -> int: ...


def ast_to_offset(node: _HasOffsetInfo) -> Offset:
    return Offset(node.lineno, node.col_offset)
`,"add_trailing_comma/_data.py":`from __future__ import annotations

import ast
import collections
import pkgutil
from collections.abc import Iterable
from typing import Callable
from typing import NamedTuple
from typing import Protocol
from typing import TypeVar

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma import _plugins


class State(NamedTuple):
    in_fstring: bool = False


AST_T = TypeVar('AST_T', bound=ast.AST)
TokenFunc = Callable[[int, list[Token]], None]
ASTFunc = Callable[[State, AST_T], Iterable[tuple[Offset, TokenFunc]]]

FUNCS: ASTCallbackMapping  # python/mypy#17566
FUNCS = collections.defaultdict(list)  # type: ignore[assignment]


def register(tp: type[AST_T]) -> Callable[[ASTFunc[AST_T]], ASTFunc[AST_T]]:
    def register_decorator(func: ASTFunc[AST_T]) -> ASTFunc[AST_T]:
        FUNCS[tp].append(func)
        return func
    return register_decorator


class ASTCallbackMapping(Protocol):
    def __getitem__(self, tp: type[AST_T]) -> list[ASTFunc[AST_T]]: ...


def visit(
        funcs: ASTCallbackMapping,
        tree: ast.AST,
) -> dict[Offset, list[TokenFunc]]:
    nodes = [(tree, State())]

    ret = collections.defaultdict(list)
    while nodes:
        node, state = nodes.pop()

        tp = type(node)
        for ast_func in funcs[tp]:
            for offset, token_func in ast_func(state, node):
                ret[offset].append(token_func)

        if tp is ast.FormattedValue:
            state = state._replace(in_fstring=True)

        for name in reversed(node._fields):
            value = getattr(node, name)
            if isinstance(value, ast.AST):
                nodes.append((value, state))
            elif isinstance(value, list):
                for value in reversed(value):
                    if isinstance(value, ast.AST):
                        nodes.append((value, state))
    return ret


def _import_plugins() -> None:
    # trigger an import of all of the plugins
    plugins_path = _plugins.__path__
    mod_infos = pkgutil.walk_packages(plugins_path, f'{_plugins.__name__}.')
    for _, name, _ in mod_infos:
        __import__(name, fromlist=['_trash'])


_import_plugins()
`,"add_trailing_comma/_main.py":`from __future__ import annotations

import argparse
import sys
from collections.abc import Iterable
from collections.abc import Sequence

from tokenize_rt import src_to_tokens
from tokenize_rt import Token
from tokenize_rt import tokens_to_src

from add_trailing_comma._ast_helpers import ast_parse
from add_trailing_comma._data import FUNCS
from add_trailing_comma._data import visit
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import fix_brace
from add_trailing_comma._token_helpers import START_BRACES


def _changing_list(lst: list[Token]) -> Iterable[tuple[int, Token]]:
    i = 0
    while i < len(lst):
        yield i, lst[i]
        i += 1


def _fix_src(contents_text: str) -> str:
    try:
        ast_obj = ast_parse(contents_text)
    except SyntaxError:
        return contents_text

    callbacks = visit(FUNCS, ast_obj)

    tokens = src_to_tokens(contents_text)
    for i, token in _changing_list(tokens):
        # DEDENT is a zero length token
        if not token.src:
            continue

        # though this is a defaultdict, by using \`.get()\` this function's
        # self time is almost 50% faster
        for callback in callbacks.get(token.offset, ()):
            callback(i, tokens)

        if token.name == 'OP' and token.src in START_BRACES:
            fix_brace(
                tokens, find_simple(i, tokens),
                add_comma=False,
                remove_comma=False,
            )

    return tokens_to_src(tokens)


def fix_file(filename: str, args: argparse.Namespace) -> int:
    if filename == '-':
        contents_bytes = sys.stdin.buffer.read()
    else:
        with open(filename, 'rb') as fb:
            contents_bytes = fb.read()

    try:
        contents_text_orig = contents_text = contents_bytes.decode()
    except UnicodeDecodeError:
        msg = f'{filename} is non-utf-8 (not supported)'
        print(msg, file=sys.stderr)
        return 1

    contents_text = _fix_src(contents_text)

    if filename == '-':
        print(contents_text, end='')
    elif contents_text != contents_text_orig:
        print(f'Rewriting {filename}', file=sys.stderr)
        with open(filename, 'wb') as f:
            f.write(contents_text.encode())

    if args.exit_zero_even_if_changed:
        return 0
    else:
        return contents_text != contents_text_orig


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('filenames', nargs='*')
    parser.add_argument('--exit-zero-even-if-changed', action='store_true')
    parser.add_argument('--py35-plus', action='store_true')
    parser.add_argument('--py36-plus', action='store_true')
    args = parser.parse_args(argv)

    if args.py35_plus or args.py36_plus:
        print('WARNING: --py35-plus / --py36-plus do nothing', file=sys.stderr)

    ret = 0
    for filename in args.filenames:
        ret |= fix_file(filename, args)
    return ret


if __name__ == '__main__':
    raise SystemExit(main())
`,"add_trailing_comma/_plugins/__init__.py":"","add_trailing_comma/_plugins/_with.py":`from __future__ import annotations

import ast
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import fix_brace


def _fix_with(i: int, tokens: list[Token]) -> None:
    i += 1
    if tokens[i].name == 'UNIMPORTANT_WS':
        i += 1
    if tokens[i].src == '(':
        fix = find_simple(i, tokens)
        # only fix if outer parens are for the with items (next is ':')
        if fix is not None and tokens[fix.braces[-1] + 1].src == ':':
            fix_brace(tokens, fix, add_comma=True, remove_comma=True)


@register(ast.With)
def visit_With(
    state: State,
    node: ast.With,
) -> Iterable[tuple[Offset, TokenFunc]]:
    yield ast_to_offset(node), _fix_with
`,"add_trailing_comma/_plugins/calls.py":`from __future__ import annotations

import ast
import functools
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_call
from add_trailing_comma._token_helpers import fix_brace


def _fix_call(
        i: int,
        tokens: list[Token],
        *,
        arg_offsets: set[Offset],
) -> None:
    return fix_brace(
        tokens,
        find_call(arg_offsets, i, tokens),
        add_comma=True,
        remove_comma=True,
    )


@register(ast.Call)
def visit_Call(
        state: State,
        node: ast.Call,
) -> Iterable[tuple[Offset, TokenFunc]]:
    argnodes: list[ast.expr | ast.keyword] = [*node.args, *node.keywords]
    arg_offsets = set()
    for argnode in argnodes:
        offset = ast_to_offset(argnode)
        # multiline strings have invalid position, ignore them
        if offset.utf8_byte_offset != -1:  # pragma: no branch (cpy bug)
            arg_offsets.add(offset)

    # If the sole argument is a generator, don't add a trailing comma as
    # this breaks lib2to3 based tools
    only_a_generator = (
        len(argnodes) == 1 and isinstance(argnodes[0], ast.GeneratorExp)
    )

    if arg_offsets and not only_a_generator and not state.in_fstring:
        func = functools.partial(
            _fix_call,
            arg_offsets=arg_offsets,
        )
        yield ast_to_offset(node), func
`,"add_trailing_comma/_plugins/classes.py":`from __future__ import annotations

import ast
import functools
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_call
from add_trailing_comma._token_helpers import fix_brace


def _fix_class(
        i: int,
        tokens: list[Token],
        *,
        arg_offsets: set[Offset],
) -> None:
    fix_brace(
        tokens,
        find_call(arg_offsets, i, tokens),
        add_comma=True,
        remove_comma=True,
    )


@register(ast.ClassDef)
def visit_ClassDef(
        state: State,
        node: ast.ClassDef,
) -> Iterable[tuple[Offset, TokenFunc]]:
    # starargs are allowed in py3 class definitions, py35+ allows trailing
    # commas.  py34 does not, but adding an option for this very obscure
    # case seems not worth it.
    args: list[ast.expr | ast.keyword] = [*node.bases, *node.keywords]
    arg_offsets = {ast_to_offset(arg) for arg in args}

    if arg_offsets:
        func = functools.partial(_fix_class, arg_offsets=arg_offsets)
        yield ast_to_offset(node), func
`,"add_trailing_comma/_plugins/functions.py":`from __future__ import annotations

import ast
import functools
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_call
from add_trailing_comma._token_helpers import fix_brace


def _fix_func(
        i: int,
        tokens: list[Token],
        *,
        arg_offsets: set[Offset],
) -> None:
    fix_brace(
        tokens,
        find_call(arg_offsets, i, tokens),
        add_comma=True,
        remove_comma=True,
    )


def visit_FunctionDef(
        state: State,
        node: ast.AsyncFunctionDef | ast.FunctionDef,
) -> Iterable[tuple[Offset, TokenFunc]]:
    args = [*node.args.posonlyargs, *node.args.args]

    if node.args.vararg:
        args.append(node.args.vararg)
    if node.args.kwarg:
        args.append(node.args.kwarg)
    if node.args.kwonlyargs:
        args.extend(node.args.kwonlyargs)

    arg_offsets = {ast_to_offset(arg) for arg in args}

    if arg_offsets:
        func = functools.partial(_fix_func, arg_offsets=arg_offsets)
        yield ast_to_offset(node), func


register(ast.AsyncFunctionDef)(visit_FunctionDef)
register(ast.FunctionDef)(visit_FunctionDef)
`,"add_trailing_comma/_plugins/imports.py":`from __future__ import annotations

import ast
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import Fix
from add_trailing_comma._token_helpers import fix_brace


def _find_import(i: int, tokens: list[Token]) -> Fix | None:
    # progress forwards until we find either a \`(\` or a newline
    for i in range(i, len(tokens)):
        token = tokens[i]
        if token.name == 'NEWLINE':
            return None
        elif token.name == 'OP' and token.src == '(':
            return find_simple(i, tokens)
    else:
        raise AssertionError('Past end?')


def _fix_import(i: int, tokens: list[Token]) -> None:
    fix_brace(
        tokens,
        _find_import(i, tokens),
        add_comma=True,
        remove_comma=True,
    )


@register(ast.ImportFrom)
def visit_ImportFrom(
        state: State,
        node: ast.ImportFrom,
) -> Iterable[tuple[Offset, TokenFunc]]:
    yield ast_to_offset(node), _fix_import
`,"add_trailing_comma/_plugins/literals.py":`from __future__ import annotations

import ast
import functools
from collections.abc import Iterable

from tokenize_rt import NON_CODING_TOKENS
from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import Fix
from add_trailing_comma._token_helpers import fix_brace


def _fix_literal(
        i: int,
        tokens: list[Token],
        *,
        one_el_tuple: bool,
) -> None:
    fix_brace(
        tokens, find_simple(i, tokens),
        add_comma=True,
        remove_comma=not one_el_tuple,
    )


@register(ast.Set)
def visit_Set(
        state: State,
        node: ast.Set,
) -> Iterable[tuple[Offset, TokenFunc]]:
    func = functools.partial(_fix_literal, one_el_tuple=False)
    yield ast_to_offset(node), func


@register(ast.List)
def visit_List(
        state: State,
        node: ast.List,
) -> Iterable[tuple[Offset, TokenFunc]]:
    if node.elts:
        func = functools.partial(_fix_literal, one_el_tuple=False)
        yield ast_to_offset(node), func


@register(ast.Dict)
def visit_Dict(
        state: State,
        node: ast.Dict,
) -> Iterable[tuple[Offset, TokenFunc]]:
    if node.values:
        func = functools.partial(_fix_literal, one_el_tuple=False)
        yield ast_to_offset(node), func


def _find_tuple(i: int, tokens: list[Token]) -> Fix | None:
    # tuples are evil, we need to backtrack to find the opening paren
    i -= 1
    while tokens[i].name in NON_CODING_TOKENS:
        i -= 1
    # Sometimes tuples don't even have a paren!
    # x = 1, 2, 3
    if tokens[i].src != '(' and tokens[i].src != '[':
        return None

    return find_simple(i, tokens)


def _fix_tuple(
        i: int,
        tokens: list[Token],
        *,
        one_el_tuple: bool,
) -> None:
    fix_brace(
        tokens,
        _find_tuple(i, tokens),
        add_comma=True,
        remove_comma=not one_el_tuple,
    )


def _fix_tuple_py38(
        i: int,
        tokens: list[Token],
        *,
        one_el_tuple: bool,
) -> None:
    fix = find_simple(i, tokens)

    # for tuples we *must* find a comma, otherwise it is not a tuple
    if fix is None or not fix.multi_arg:
        return

    fix_brace(
        tokens,
        fix,
        add_comma=True,
        remove_comma=not one_el_tuple,
    )


@register(ast.Tuple)
def visit_Tuple(
        state: State,
        node: ast.Tuple,
) -> Iterable[tuple[Offset, TokenFunc]]:
    if node.elts:
        is_one_el = len(node.elts) == 1
        if ast_to_offset(node) == ast_to_offset(node.elts[0]):
            func = functools.partial(_fix_tuple, one_el_tuple=is_one_el)
            yield ast_to_offset(node), func
        else:
            func = functools.partial(_fix_tuple_py38, one_el_tuple=is_one_el)
            yield ast_to_offset(node), func
`,"add_trailing_comma/_plugins/match.py":`from __future__ import annotations

import ast
import functools
import sys
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_call
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import fix_brace


if sys.version_info >= (3, 10):  # pragma: >=3.10 cover
    def _fix_match_class(
            i: int,
            tokens: list[Token],
            *,
            arg_offsets: set[Offset],
    ) -> None:
        return fix_brace(
            tokens,
            find_call(arg_offsets, i, tokens),
            add_comma=True,
            remove_comma=True,
        )

    @register(ast.MatchClass)
    def visit_MatchClass(
            state: State,
            node: ast.MatchClass,
    ) -> Iterable[tuple[Offset, TokenFunc]]:
        arg_offsets = {ast_to_offset(pat) for pat in node.patterns}
        arg_offsets |= {ast_to_offset(pat) for pat in node.kwd_patterns}
        if arg_offsets:  # can't add commas without args!
            func = functools.partial(_fix_match_class, arg_offsets=arg_offsets)
            yield ast_to_offset(node), func

    def _fix_mapping(i: int, tokens: list[Token]) -> None:
        fix_brace(
            tokens,
            find_simple(i, tokens),
            add_comma=True,
            remove_comma=True,
        )

    def _fix_sequence(i: int, tokens: list[Token], *, n: int) -> None:
        if tokens[i].src not in '[(':
            return  # not actually a braced sequence
        remove_comma = tokens[i].src == '[' or n > 1
        fix_brace(
            tokens,
            find_simple(i, tokens),
            add_comma=True,
            remove_comma=remove_comma,
        )

    @register(ast.MatchMapping)
    def visit_MatchMapping(
            state: State,
            node: ast.MatchMapping,
    ) -> Iterable[tuple[Offset, TokenFunc]]:
        yield ast_to_offset(node), _fix_mapping

    @register(ast.MatchSequence)
    def visit_MatchSequence(
            state: State,
            node: ast.MatchSequence,
    ) -> Iterable[tuple[Offset, TokenFunc]]:
        func = functools.partial(_fix_sequence, n=len(node.patterns))
        yield ast_to_offset(node), func
`,"add_trailing_comma/_plugins/pep695.py":`from __future__ import annotations

import ast
import sys
from collections.abc import Iterable

from tokenize_rt import Offset
from tokenize_rt import Token

from add_trailing_comma._ast_helpers import ast_to_offset
from add_trailing_comma._data import register
from add_trailing_comma._data import State
from add_trailing_comma._data import TokenFunc
from add_trailing_comma._token_helpers import find_simple
from add_trailing_comma._token_helpers import fix_brace


if sys.version_info >= (3, 12):  # pragma: >=3.12 cover
    def _fix_pep695(
        i: int,
        tokens: list[Token],
    ) -> None:
        for n in range(i, len(tokens)):
            token = tokens[n]
            if token.name == 'OP' and token.src == '[':
                return fix_brace(
                    tokens,
                    find_simple(n, tokens),
                    add_comma=True,
                    remove_comma=True,
                )
        else:
            raise AssertionError('Past end?')

    def visit_pep695(
        state: State,
        node: ast.TypeAlias | ast.ClassDef | ast.FunctionDef,
    ) -> Iterable[tuple[Offset, TokenFunc]]:
        if node.type_params:
            yield ast_to_offset(node), _fix_pep695

    register(ast.TypeAlias)(visit_pep695)
    register(ast.ClassDef)(visit_pep695)
    register(ast.FunctionDef)(visit_pep695)
`,"add_trailing_comma/_token_helpers.py":`from __future__ import annotations

from typing import NamedTuple

from tokenize_rt import ESCAPED_NL
from tokenize_rt import NON_CODING_TOKENS
from tokenize_rt import Offset
from tokenize_rt import Token
from tokenize_rt import UNIMPORTANT_WS

NEWLINES = frozenset((ESCAPED_NL, 'NEWLINE', 'NL'))
INDENT_TOKENS = frozenset(('INDENT', UNIMPORTANT_WS))
START_BRACES = frozenset(('(', '{', '['))
END_BRACES = frozenset((')', '}', ']'))


class Fix(NamedTuple):
    braces: tuple[int, int]
    multi_arg: bool
    remove_comma: bool
    initial_indent: int


def find_simple(first_brace: int, tokens: list[Token]) -> Fix | None:
    brace_stack = [first_brace]
    multi_arg = False

    for i in range(first_brace + 1, len(tokens)):
        token = tokens[i]
        if token.name == 'OP' and token.src in START_BRACES:
            brace_stack.append(i)
        elif token.name == 'OP' and token.src in END_BRACES:
            brace_stack.pop()

        if len(brace_stack) == 1 and token.src == ',':
            multi_arg = True

        if not brace_stack:
            break
    else:
        raise AssertionError('Past end?')

    last_brace = i

    # Check if we're actually multi-line
    if (
            # we were single line, but with an extra comma and or whitespace
            tokens[first_brace].line == tokens[last_brace].line and (
                tokens[last_brace - 1].name == UNIMPORTANT_WS or
                tokens[last_brace - 1].src == ','
            )
    ):
        remove_comma = True
    elif tokens[first_brace].line == tokens[last_brace].line:
        return None
    else:
        remove_comma = False

    # determine the initial indentation
    i = first_brace
    while i >= 0 and tokens[i].name not in NEWLINES:
        i -= 1

    if i >= 0 and tokens[i + 1].name in INDENT_TOKENS:
        initial_indent = len(tokens[i + 1].src)
    else:
        initial_indent = 0

    return Fix(
        (first_brace, last_brace),
        multi_arg=multi_arg,
        remove_comma=remove_comma,
        initial_indent=initial_indent,
    )


def find_call(
        arg_offsets: set[Offset],
        i: int,
        tokens: list[Token],
) -> Fix | None:
    # When we get a \`call\` object, the ast refers to it as this:
    #
    #     func_name(arg, arg, arg)
    #     ^ where ast points
    #
    # We care about the closing paren, in order to find it, we first walk
    # until we find an argument.  When we find an argument, we know the outer
    # paren we find is the function call paren
    #
    #     func_name(arg, arg, arg)
    #              ^ outer paren
    first_brace = None
    paren_stack = []
    for i in range(i, len(tokens)):
        token = tokens[i]
        if token.name == 'OP' and token.src == '(':
            paren_stack.append(i)
        # the ast lies to us about the beginning of parenthesized functions.
        # See #3. (why we make sure there's something to pop here)
        elif token.name == 'OP' and token.src == ')' and paren_stack:
            paren_stack.pop()

        if (token.line, token.utf8_byte_offset) in arg_offsets:
            first_brace = paren_stack[0]
            break
    else:
        raise AssertionError('Past end?')

    return find_simple(first_brace, tokens)


def fix_brace(
        tokens: list[Token],
        fix_data: Fix | None,
        add_comma: bool,
        remove_comma: bool,
) -> None:
    if fix_data is None:
        return
    first_brace, last_brace = fix_data.braces

    # Figure out if either of the braces are "hugging"
    hug_open = tokens[first_brace + 1].name not in NON_CODING_TOKENS
    hug_close = tokens[last_brace - 1].name not in NON_CODING_TOKENS
    if (
            # Don't unhug single element things with a multi-line component
            # inside.
            not fix_data.multi_arg and
            tokens[first_brace + 1].src in START_BRACES and
            tokens[last_brace - 1].src in END_BRACES or
            # Don't unhug when containing a single token (such as a triple
            # quoted string).
            first_brace + 2 == last_brace or
            (
                tokens[first_brace + 1].name == 'FSTRING_START' and
                tokens[last_brace - 1].name == 'FSTRING_END'
            ) or
            (
                tokens[first_brace + 1].name == 'TSTRING_START' and
                tokens[last_brace - 1].name == 'TSTRING_END'
            ) or
            # don't unhug if it is a single line
            fix_data.remove_comma
    ):
        hug_open = hug_close = False

    # fix open hugging
    if hug_open:
        new_indent = fix_data.initial_indent + 4

        tokens[first_brace + 1:first_brace + 1] = [
            Token('NL', '\\n'), Token(UNIMPORTANT_WS, ' ' * new_indent),
        ]
        last_brace += 2
        # Adjust indentation for the rest of the things
        min_indent = None
        indents = []
        insert_indents = []
        for i in range(first_brace + 3, last_brace):
            if tokens[i - 1].name == 'NL' and tokens[i].name != 'NL':
                if tokens[i].name != UNIMPORTANT_WS:
                    min_indent = 0
                    insert_indents.append(i)
                else:
                    if min_indent is None:
                        min_indent = len(tokens[i].src)
                    elif len(tokens[i].src) < min_indent:
                        min_indent = len(tokens[i].src)
                    indents.append(i)

        if indents:
            assert min_indent is not None
            for i in indents:
                oldlen = len(tokens[i].src)
                newlen = oldlen - min_indent + new_indent
                tokens[i] = tokens[i]._replace(src=' ' * newlen)
        for i in reversed(insert_indents):
            tokens.insert(i, Token(UNIMPORTANT_WS, ' ' * new_indent))
            last_brace += 1

    # fix close hugging
    if hug_close:
        tokens[last_brace:last_brace] = [
            Token('NL', '\\n'),
            Token(UNIMPORTANT_WS, ' ' * fix_data.initial_indent),
        ]
        last_brace += 2

    # From there, we can walk backwards and decide whether a comma is needed
    i = last_brace - 1
    while tokens[i].name in NON_CODING_TOKENS:
        i -= 1

    # If we're not a hugging paren, we can insert a comma
    if add_comma and tokens[i].src != ',' and i + 1 != last_brace:
        tokens.insert(i + 1, Token('OP', ','))

    # Fix trailing brace to match leading indentation
    back_1 = tokens[last_brace - 1]
    back_2 = tokens[last_brace - 2]
    if (
            back_1.name == UNIMPORTANT_WS and
            back_2.name == 'NL' and
            len(back_1.src) != fix_data.initial_indent
    ):
        indent = fix_data.initial_indent * ' '
        tokens[last_brace - 1] = back_1._replace(src=indent)

    if fix_data.remove_comma:
        start = last_brace
        if tokens[start - 1].name == UNIMPORTANT_WS:
            start -= 1
        if remove_comma and tokens[start - 1].src == ',':
            start -= 1
        del tokens[start:last_brace]
`},paths:[{label:"Python \uC18C\uC2A4\uB97C AST\uB85C \uBCC0\uD658",nodes:["add_trailing_comma._main.main","add_trailing_comma._main.fix_file","add_trailing_comma._main._fix_src","add_trailing_comma._ast_helpers.ast_parse"]},{label:"AST\uB97C \uC21C\uD68C\uD574 \uBCC0\uD658 \uCF5C\uBC31 \uC218\uC9D1",nodes:["add_trailing_comma._main.main","add_trailing_comma._main.fix_file","add_trailing_comma._main._fix_src","add_trailing_comma._data.visit"]},{label:"\uAD04\uD638 \uC8FC\uBCC0\uC758 \uC904\uBC14\uAFC8\uACFC \uB4E4\uC5EC\uC4F0\uAE30 \uC815\uB9AC",nodes:["add_trailing_comma._main.main","add_trailing_comma._main.fix_file","add_trailing_comma._main._fix_src","add_trailing_comma._token_helpers.fix_brace"]}]};var Y="http://www.w3.org/2000/svg";var J=0;function b(n,e={},a){let t=document.createElementNS(Y,n);for(let[o,i]of Object.entries(e))t.setAttribute(o,i);return a!==void 0&&(t.textContent=a),t}function z(n,e){let a=new Map;for(let t of n.calls)e.has(t.from)&&(a.has(t.from)||a.set(t.from,[]),a.get(t.from).push(t));return a}function W(n,e,a){let t=new Map([[e,null]]),o=[e];for(let i=0;i<o.length;i+=1){let r=o[i];if(r===a){let d=[];for(let c=t.get(r);c;c=t.get(c.from))d.push(c);return d.reverse()}for(let d of n.get(r)??[])d.to==null||t.has(d.to)||(t.set(d.to,d),o.push(d.to))}return null}function H(n,e,a){let t=new Set(n.functions.map(({id:o})=>o));return!t.has(e)||!t.has(a)?null:W(z(n,t),e,a)}function $(n,e){return{key:`function:${n.id}`,fn:n,depth:e}}function Q(n,e,a,t,o){let i=new Map([[a,$(e.get(a),0)]]),r=[a],d=!1;for(let f=0;f<r.length;f+=1){let T=r[f],O=i.get(T).depth+1;for(let N of n.get(T)??[])if(!(!e.has(N.to)||i.has(N.to))){if(O>3||i.size>=22){d=!0;continue}i.set(N.to,$(e.get(N.to),O)),r.push(N.to)}}let c=new Set(o?.map(({id:f})=>f));t.selectedCallId!=null&&c.add(t.selectedCallId);let u=r.flatMap(f=>n.get(f)??[]),s=[...u.filter(f=>c.has(f.id)),...u.filter(f=>!c.has(f.id))],m=[],g=[];for(let f of s){let T=i.get(f.from);i.has(f.to)?m.push({call:f,source:T,target:i.get(f.to)}):f.to==null&&g.push({call:f,source:T})}let y=({call:f})=>c.has(f.id)?0:f.reasonCode==="dynamic"||f.reasonCode==="ambiguous"?/^[\p{ID_Start}_][\p{ID_Continue}]*$/u.test(f.label)?1:2:3;g.sort((f,T)=>y(f)-y(T));let x=g.slice(0,8).map(({call:f,source:T})=>({call:f,source:T,target:{key:`unresolved:${f.id}`,call:f,depth:Math.min(T.depth+1,3)}}));d||=g.length>8;let k=new Map;for(let f of m)f.source.depth+1===f.target.depth&&(k.has(f.target.key)||k.set(f.target.key,f));let C=new Set([...m.filter(({call:f})=>c.has(f.id)),...k.values(),...x,...m]);d||=C.size>48;let w=[...C].slice(0,48);return{vertices:[...i.values(),...w.filter(({call:f})=>f.to==null).map(({target:f})=>f)],edges:w,truncated:d}}function Z(n,e,a){let t=[$(n.get(e),0)],o=a.map((i,r)=>{let d=t[r],c=$(n.get(i.to),r+1);return t.push(c),{call:i,source:d,target:c}});return{vertices:t,edges:o,truncated:!1}}function nn(n,e){let a=new Map;for(let c of n)a.has(c.depth)||a.set(c.depth,[]),a.get(c.depth).push(c);let t=Math.max(...a.keys()),o=Math.max(...Array.from(a.values(),({length:c})=>c)),i=t*232+166,r=i+82,d=Math.max(e,(o-1)*78+54+60);for(let[c,u]of a){let s=(r-i)/2+c*232,m=(d-(u.length-1)*78-54)/2;u.forEach((g,y)=>{g.x=s,g.y=m+y*78})}return{width:r,height:d}}function U(n,e,a,t,o){n.setAttribute("tabindex","0"),n.setAttribute("role","button"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",t),n.dataset.graphControl=e,n.append(b("title",{},a)),n.addEventListener("click",o),n.addEventListener("keydown",i=>{i.key!=="Enter"&&i.key!==" "||(i.preventDefault(),i.repeat||o())})}function P(n,e){let a=0,t="";for(let o of n){if(a+=/[\u1100-\u11ff\u2e80-\ua4cf\uac00-\ud7af\uf900-\ufaff\uff01-\uff60]/u.test(o)?2:1,a>e)return`${t}\u2026`;t+=o}return t}function en(n,e){return`${n.split("/").at(-1)}:${e}`}function tn(n,e){let{x:a,y:t,fn:o,call:i}=n,r=o?.id===e.entryId,d=o?o.id===e.selectedFunctionId:i.id===e.selectedCallId,c=b("g",{class:["atlas-graph__vertex",r?"is-entry":"",o?"":"is-unresolved",d?"is-selected":""].filter(Boolean).join(" "),transform:`translate(${a} ${t})`});o?c.dataset.functionId=o.id:c.dataset.unresolvedCallId=i.id;let u=o?.qualname??i.label,s=o?.kind==="method"?u.split(".").slice(-2).join("."):o?.name??i.label,m=o?en(o.file,o.line):"\uD574\uC11D\uB418\uC9C0 \uC54A\uC740 \uD638\uCD9C",g=o?`${r?"\uC9C4\uC785\uC810 ":"\uD568\uC218 "}${u}, ${o.file} ${o.line}\uC904`:`\uD574\uC11D\uB418\uC9C0 \uC54A\uC740 \uD638\uCD9C ${i.label}, ${i.file} ${i.line}\uC904`;return U(c,n.key,g,d,()=>{o?e.onFunction?.(o.id):e.onCall?.(i.id)}),c.append(b("rect",{class:"atlas-graph__card",width:166,height:54,rx:8}),b("rect",{class:"atlas-graph__glyph-box",x:10,y:12,width:23,height:23,rx:5}),b("text",{class:"atlas-graph__glyph",x:21.5,y:28},o?r?"\u21A6":"\u0192":"?"),b("text",{class:"atlas-graph__name",x:41,y:23},P(s,16)),b("text",{class:"atlas-graph__location",x:41,y:39},P(m,19))),c}function on(n,e,a){if(n===e){let s=n.x+166,m=n.y+27,g=s+36+Math.abs(a);return`M ${s} ${m-11-a} C ${g} ${m-29-a} ${g} ${m+30+a} ${s+3} ${m+13+a}`}let o=n.y+27+a,i=e.y+27+a;if(n.x===e.x){let s=n.x+166,m=s+33+Math.abs(a);return`M ${s} ${o} C ${m} ${o} ${m} ${i} ${s+3} ${i}`}let r=n.x<e.x,d=n.x+(r?166:0),c=e.x+(r?-3:169),u=(d+c)/2;return`M ${d} ${o} C ${u} ${o} ${u} ${i} ${c} ${i}`}function an(n,e,a,t,o){let{call:i,source:r,target:d}=n,c=i.id===e.selectedCallId,u=a.has(i.id),s=i.to==null,m=b("g",{class:["atlas-graph__edge",c?"is-selected":"",u?"is-route":"",s?"is-unresolved":""].filter(Boolean).join(" ")});m.dataset.callId=i.id;let g=d.fn?.qualname??`${i.label} (\uD574\uC11D\uB418\uC9C0 \uC54A\uC74C)`,y=`${r.fn.qualname} \u2192 ${g}, ${i.file} ${i.line}\uC904`;U(m,`call:${i.id}`,y,c,()=>e.onCall?.(i.id));let x=on(r,d,o),k=c||u?t.route:s?t.unresolved:t.normal;return m.append(b("path",{class:"atlas-graph__edge-line",d:x,"marker-end":`url(#${k})`}),b("path",{class:"atlas-graph__edge-hit",d:x})),m}function sn(n){let e=b("defs"),a=++J,t={};for(let o of["normal","route","unresolved"]){let i=`atlas-${a}-arrow-${o}`,r=b("marker",{id:i,markerUnits:"userSpaceOnUse",viewBox:"0 0 9 10",refX:8.5,refY:5,markerWidth:8,markerHeight:9,orient:"auto"});r.append(b("path",{class:`atlas-graph__marker atlas-graph__marker--${o}`,d:"M 0 0 L 9 5 L 0 10 z"})),e.append(r),t[o]=i}return n.append(e),t}function rn(n){let e=new Map;for(let t of n){e.has(t.source)||e.set(t.source,new Map);let o=e.get(t.source);o.has(t.target)||o.set(t.target,[]),o.get(t.target).push(t)}let a=new Map;for(let t of e.values())for(let o of t.values()){let i=Math.min(12,32/Math.max(1,o.length-1));o.forEach((r,d)=>{a.set(r,(d-(o.length-1)/2)*i)})}return a}function R(n,e){let a=document.createElement("p");return a.className="atlas-graph__empty",a.textContent=e,n.replaceChildren(a),{visibleNodes:0,visibleCalls:0,truncated:!1}}function j(n,e,a={}){let t=new Map(e.functions.map(h=>[h.id,h])),o=a.entryId??e.entries[0]?.id??e.functions[0]?.id,i=a.mode??"overview",r=n.contains(document.activeElement)?document.activeElement.dataset.graphControl:void 0,d=n.dataset.graphEntry===o&&n.dataset.graphMode===i,c=[n.scrollLeft,n.scrollTop];if(n.classList.add("atlas-graph"),n.dataset.graphEntry=o??"",n.dataset.graphMode=i,!t.has(o))return R(n,"\uC9C0\uB3C4\uC5D0 \uD45C\uC2DC\uD560 \uD568\uC218\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");let u=z(e,t),s=a.selectedFunctionId??o,m=W(u,o,s);if(i==="path"&&m==null)return R(n,"\uC774 \uC9C4\uC785\uC810\uC5D0\uC11C \uC120\uD0DD\uD55C \uD568\uC218\uAE4C\uC9C0 \uD655\uC778\uB41C \uD638\uCD9C \uACBD\uB85C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");let g=i==="path"?Z(t,o,m):Q(u,t,o,a,m),{width:y,height:x}=nn(g.vertices,n.clientHeight),k=b("svg",{class:"atlas-graph__canvas",width:y,height:x,role:"group","aria-label":i==="path"?"\uC120\uD0DD\uD55C \uD568\uC218\uAE4C\uC9C0\uC758 \uD638\uCD9C \uACBD\uB85C":"\uC9C4\uC785\uC810\uC5D0\uC11C \uC2DC\uC791\uD558\uB294 \uD638\uCD9C \uADF8\uB798\uD504"}),C=sn(k),w=new Set(m?.map(({id:h})=>h)),f=rn(g.edges),T=({call:h})=>h.id===a.selectedCallId||w.has(h.id),O=[...g.edges.filter(h=>!T(h)),...g.edges.filter(T)];for(let h of O)k.append(an(h,a,w,C,f.get(h)));for(let h of g.vertices)k.append(tn(h,{...a,entryId:o}));return n.replaceChildren(k),[...k.querySelectorAll("[data-graph-control]")].find(h=>h.dataset.graphControl===r)?.focus({preventScroll:!0}),d?[n.scrollLeft,n.scrollTop]=c:(n.scrollLeft=0,n.scrollTop=Math.max(0,(x-n.clientHeight)/2)),{visibleNodes:g.vertices.length,visibleCalls:g.edges.length,truncated:g.truncated}}var ln=n=>document.getElementById(n),l=Object.fromEntries(["open-example","folder","status","empty","workspace","project-kind","project-title","project-source","stats","guides","entry","search","result-count","results","overview","path","route","graph","graph-caption","evidence-heading","details"].map(n=>[n,ln(n)])),_n={function:"\uD568\uC218",method:"\uBA54\uC11C\uB4DC",module:"\uBAA8\uB4C8"},cn=new Set([".git",".venv","venv",".tox",".nox",".mypy_cache",".pytest_cache","__pycache__","node_modules","site-packages","build","dist"]),dn=800,fn=12*1024*1024,mn=768*1024,_=null,S=null,M=0;function p(n,e={},...a){let t=document.createElement(n);return Object.assign(t,e),t.append(...a),t}function F(n,e,a=""){return p("a",{className:a,href:e,target:"_blank",rel:"noopener noreferrer"},n)}function L(n="",e=!1){l.status.textContent=n,l.status.classList.toggle("error",e)}function q(n){return S?.terminate(),S=null,l.workspace.setAttribute("aria-busy","true"),L(n),++M}function v(n,e){n===M&&(l.workspace.removeAttribute("aria-busy"),L(e,!0))}function B(n,e,a){if(n===M)try{let t=new Worker(new URL("./analysis-worker.js",import.meta.url));S=t,t.onmessage=({data:o})=>{if(o.token===M)if(t.terminate(),S=null,o.error)v(n,o.error);else if(!o.graph.functions.some(i=>i.kind!=="module")&&o.graph.calls.length===0)v(n,"\uD45C\uC2DC\uD560 \uD568\uC218\uB098 \uD638\uCD9C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. Python \uC18C\uC2A4\uC5D0 \uD568\uC218 \uC815\uC758 \uB610\uB294 \uD638\uCD9C\uC774 \uC788\uB294\uC9C0 \uD655\uC778\uD558\uC138\uC694.");else try{un(a,o.graph)}catch{v(n,"\uC9C0\uB3C4 \uD654\uBA74\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 Python \uD3F4\uB354\uB97C \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.")}},t.onerror=()=>{t.terminate(),S===t&&(S=null),v(n,"\uBD84\uC11D \uC791\uC5C5\uC744 \uC2DC\uC791\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC774 \uB370\uBAA8\uB97C \uC815\uC801 HTTP \uC11C\uBC84\uC5D0\uC11C \uC5F4\uC5B4 \uC8FC\uC138\uC694.")},t.postMessage({token:n,files:e})}catch{v(n,"\uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uBD84\uC11D \uC791\uC5C5\uC744 \uC2DC\uC791\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.")}}l["open-example"].addEventListener("click",()=>{let n=q("\uACF5\uAC1C \uC608\uC81C\uC758 \uD638\uCD9C \uAD00\uACC4\uB97C \uC77D\uB294 \uC911\uC785\uB2C8\uB2E4\u2026");B(n,A.files,{title:A.title,example:A})});l.folder.addEventListener("change",async()=>{let n=Array.from(l.folder.files);if(l.folder.value="",!n.length)return;let e=q("\uC120\uD0DD\uD55C \uD3F4\uB354\uC758 Python \uC18C\uC2A4\uB97C \uC77D\uB294 \uC911\uC785\uB2C8\uB2E4\u2026"),a=n[0].webkitRelativePath.split("/")[0]||"\uB0B4 Python \uD504\uB85C\uC81D\uD2B8",t=n.flatMap(o=>{let i=o.webkitRelativePath.split("/").slice(1);return!i.length||!/\.py$/.test(o.name)||i.some(r=>!r||r==="."||r==="..")||i.slice(0,-1).some(r=>cn.has(r))?[]:[[i.join("/"),o]]});if(!t.length)return v(e,"\uC120\uD0DD\uD55C \uD3F4\uB354\uC5D0\uC11C \uBD84\uC11D\uD560 .py \uD30C\uC77C\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(t.length>dn||t.some(([,o])=>o.size>mn)||t.reduce((o,[,i])=>o+i.size,0)>fn)return v(e,"\uBD84\uC11D \uD55C\uB3C4\uB294 Python \uD30C\uC77C 800\uAC1C, \uD30C\uC77C\uB2F9 768 KiB, \uC804\uCCB4 12 MiB\uC785\uB2C8\uB2E4. \uC18C\uC2A4\uAC00 \uB4E4\uC5B4 \uC788\uB294 \uD558\uC704 \uD3F4\uB354\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");try{let o=await Promise.all(t.map(async([i,r])=>{let d=await r.arrayBuffer(),c=/^\s*#.*?coding[:=]\s*([-\w.]+)/m.exec(new TextDecoder().decode(d.slice(0,256)).split(/\r?\n/,2).join(`
`))?.[1],u=new TextDecoder;if(c&&!/^utf[-_]?8(?:[-_]sig)?$/i.test(c)){let s=/^(latin[-_]?1|iso[-_]?8859[-_]?1)$/i.test(c)?"iso-8859-1":c.replaceAll("_","-");try{u=new TextDecoder(s)}catch{}}return[i,u.decode(d)]}));B(e,Object.fromEntries(o),{title:a})}catch{v(e,"\uC120\uD0DD\uD55C \uD30C\uC77C\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD3F4\uB354\uC5D0 \uC811\uADFC\uD560 \uC218 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.")}});function pn(n,e){let a=_.project.example;if(!a)return null;let t=[a.sourceRoot,n].filter(Boolean).join("/").split("/").filter(Boolean).map(encodeURIComponent).join("/");return`${a.repository}/blob/${a.commit}/${t}#L${e}`}function un(n,e){let a=new Map(e.functions.map(s=>[s.id,s])),t=(n.example?.paths||[]).map(s=>({label:s.label,nodes:s.nodes.map(m=>e.functions.find(g=>g.qualname===m)?.id)})).filter(s=>s.nodes.every(Boolean)),o=t[0]?.nodes[0]||e.entries[0]?.id||e.functions[0]?.id,i=e.entries.slice();t.length&&!i.some(s=>s.id===o)&&i.unshift({id:o,reason:"\uACF5\uAC1C \uC608\uC81C CLI \uC9C4\uC785\uC810"});let r=new Map,d=new Map,c=0;for(let s of e.calls)r.has(s.from)||r.set(s.from,[]),r.get(s.from).push(s),s.to?(d.has(s.to)||d.set(s.to,[]),d.get(s.to).push(s)):c++;if(_={project:n,graph:e,lookup:a,byFrom:r,byTo:d,entries:i,guides:t,entryId:o,selectedFunctionId:o,selectedCallId:null,mode:"overview"},l.empty.hidden=!0,l.workspace.hidden=!1,l.workspace.removeAttribute("aria-busy"),l["project-kind"].textContent=n.example?"01 / \uACF5\uAC1C \uC608\uC81C":"02 / \uC774 \uD0ED\uC758 \uB85C\uCEEC \uD504\uB85C\uC81D\uD2B8",l["project-title"].textContent=n.title,l["project-source"].replaceChildren(),n.example){let s=n.example;l["project-source"].append(F("GitHub \uC6D0\uBCF8",s.repository),F(s.commit.slice(0,12),`${s.repository}/commit/${s.commit}`),F(`${s.license} \uB77C\uC774\uC120\uC2A4`,"./example/LICENSE.txt"),"\uD3EC\uD568 \uBC94\uC704: Python \uD328\uD0A4\uC9C0 \uC18C\uC2A4")}else l["project-source"].textContent="\uD604\uC7AC \uD0ED\uC5D0\uC11C\uB9CC \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uBA74 \uC120\uD0DD\uD55C \uD3F4\uB354\uC640 \uC9C0\uB3C4\uAC00 \uCD08\uAE30\uD654\uB429\uB2C8\uB2E4.";l.stats.replaceChildren(...[[Object.keys(e.files).length,"\uD30C\uC77C"],[e.functions.filter(s=>s.kind!=="module").length,"\uD568\uC218\xB7\uBA54\uC11C\uB4DC"],[e.calls.length-c,"\uD655\uC778\uB41C \uD638\uCD9C"],[c,"\uBBF8\uD574\uACB0 \uD638\uCD9C"]].map(([s,m])=>p("span",{},p("strong",{},s.toLocaleString("ko"))," "+m))),l.guides.hidden=!t.length,l.guides.replaceChildren(p("strong",{},"\uC608\uC81C \uACBD\uB85C"));for(let s of t){let m=p("button",{type:"button"},s.label);m.addEventListener("click",()=>{_.entryId=s.nodes[0],l.entry.value=_.entryId,I(s.nodes.at(-1),"path")}),l.guides.append(m)}gn(),l.search.value="",E();let u=e.diagnostics||[];L(u.length?`\uAD6C\uBB38\uC744 \uC77D\uC9C0 \uBABB\uD55C \uC704\uCE58 ${u.length}\uACF3\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uCCAB \uC704\uCE58: ${u[0].file}:${u[0].line}. \uC77D\uC744 \uC218 \uC788\uB294 \uBD80\uBD84\uC73C\uB85C \uC9C0\uB3C4\uB97C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4.`:""),l["project-title"].focus()}function gn(){let n=p("optgroup",{label:"\uC790\uB3D9\uC73C\uB85C \uCC3E\uC740 \uC9C4\uC785\uC810"}),e=p("optgroup",{label:"\uC9C1\uC811 \uC120\uD0DD"}),a=new Set;for(let{id:t,reason:o}of _.entries){let i=_.lookup.get(t);!i||a.has(t)||(n.append(p("option",{value:t},`${i.qualname} \xB7 ${o}`)),a.add(t))}for(let t of _.graph.functions)a.has(t.id)||e.append(p("option",{value:t.id},`${t.qualname} \xB7 ${t.file}:${t.line}`));l.entry.replaceChildren(...[n,e].filter(t=>t.children.length)),l.entry.value=_.entryId}function X(){let n=l.search.value.trim().toLowerCase(),e=_.graph.functions.filter(t=>(t.kind!=="module"||n)&&(!n||t.qualname.toLowerCase().includes(n)||t.file.toLowerCase().includes(n))),a=180;l["result-count"].textContent=`${e.length}\uAC1C${e.length>a?` \xB7 \uCC98\uC74C ${a}\uAC1C \uD45C\uC2DC`:""}`,l.results.replaceChildren(...e.slice(0,a).map(t=>{let o=p("button",{type:"button",className:"result",title:t.qualname},p("b",{},t.name),p("small",{},`${t.file}:${t.line}`));return o.dataset.resultId=t.id,t.id===_.selectedFunctionId&&!_.selectedCallId&&o.setAttribute("aria-current","true"),o.addEventListener("click",()=>{I(t.id,"path"),Array.from(l.results.children).find(i=>i.dataset.resultId===t.id)?.focus({preventScroll:!0})}),o})),e.length||l.results.append(p("p",{className:"muted"},"\uC77C\uCE58\uD558\uB294 \uD568\uC218\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."))}function D(n,e,a=0){let t=p("pre",{className:"code"}),o=_.graph.files[e.file]?.split(/\r\n|\n|\r/),i=Math.max(1,e.line-a),r=Math.max(e.line,e.endLine||e.line),d=Math.min(o?.length??1/0,r+a,i+47),c=o?o.slice(i-1,d):(e.code||"").split(`
`).slice(0,48),u=p("code");c.forEach((g,y)=>{let x=i+y,k=p("span",{className:"line-number"},String(x));k.setAttribute("aria-hidden","true"),u.append(p("span",{className:`code-line${x===e.line?" marked":""}`},k,g||" "))}),t.append(u);let s=p("details",{className:"snippet",open:!0},p("summary",{},n),p("p",{className:"snippet-location"},`${e.file}:${e.line}${r!==e.line?`\u2013${r}`:""}`),t);r>d&&s.append(p("p",{className:"muted"},"\uBBF8\uB9AC\uBCF4\uAE30\uB294 \uC55E\uBD80\uBD84 48\uC904\uAE4C\uC9C0 \uD45C\uC2DC\uD569\uB2C8\uB2E4."));let m=pn(e.file,e.line);return m&&s.append(F("\uC774 \uC904\uC758 GitHub \uC6D0\uBB38 \u2197",m,"permalink")),s}function hn(n,e){return _.lookup.get(e?n.to:n.from)?.qualname||`${n.label} \xB7 \uBBF8\uD574\uACB0`}function G(n,e,a){if(!e.length)return null;function t(i){return p("div",{className:"edge-list"},...i.map(r=>{let d=p("button",{type:"button",className:`edge-item${r.to?"":" unresolved"}`},p("b",{},hn(r,a)),p("small",{},`${r.file}:${r.line}`));return d.addEventListener("click",()=>V(r.id,!0)),d}))}let o=p("div",{},p("h4",{className:"detail-label"},`${n} \xB7 ${e.length}`),t(e.slice(0,18)));if(e.length>18){let i=p("details",{className:"snippet"},p("summary",{},`\uB098\uBA38\uC9C0 ${e.length-18}\uAC1C \uBCF4\uAE30`));i.addEventListener("toggle",()=>{i.open&&i.children.length===1&&i.append(t(e.slice(18)))}),o.append(i)}return o}function kn(){let n=_.lookup.get(_.selectedFunctionId),e=_.selectedCallId&&_.graph.calls.find(a=>a.id===_.selectedCallId);if(e){let a=_.lookup.get(e.from),t=_.lookup.get(e.to);if(l.details.replaceChildren(p("h4",{className:"detail-title"},`${a?.name||"?"} \u2192 ${t?.name||e.label}`),p("p",{className:e.to?"detail-meta":"warning"},e.to?"\uD655\uC778\uB41C \uD638\uCD9C":`\uD574\uC11D\uB418\uC9C0 \uC54A\uC740 \uD638\uCD9C \xB7 ${e.reason||"\uB300\uC0C1\uC744 \uC815\uC801\uC73C\uB85C \uD655\uC815\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."}`),D("\uD638\uCD9C \uC704\uCE58",e,2)),t&&l.details.append(D("\uD638\uCD9C \uB300\uC0C1\uC758 \uC815\uC758",t)),a){let o=p("button",{className:"backlink",type:"button"},`${a.name} \uD568\uC218\uC758 \uADFC\uAC70 \uBCF4\uAE30`);o.addEventListener("click",()=>{I(a.id,_.mode),l["evidence-heading"].focus()}),l.details.append(o)}}else n?l.details.replaceChildren(p("h4",{className:"detail-title"},n.qualname),p("p",{className:"detail-meta"},_n[n.kind]||"\uD568\uC218"),D(n.kind==="module"?"\uBAA8\uB4C8 \uC2DC\uC791 \uC704\uCE58":"\uC815\uC758 \uC704\uCE58",n),...[G("\uD638\uCD9C\uD558\uB294 \uACF3",_.byFrom.get(n.id)||[],!0),G("\uC774 \uD568\uC218\uB97C \uD638\uCD9C\uD55C \uACF3",_.byTo.get(n.id)||[],!1)].filter(Boolean)):l.details.replaceChildren(p("p",{className:"muted"},"\uD568\uC218 \uB610\uB294 \uC5F0\uACB0\uC120\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694."));l.details.scrollTop=0}function I(n,e){_.selectedFunctionId=n,_.selectedCallId=null,_.mode=e,E()}function V(n,e=!1){_.selectedCallId=n,E(),e&&l["evidence-heading"].focus()}function bn(){l.overview.setAttribute("aria-pressed",String(_.mode==="overview")),l.path.setAttribute("aria-pressed",String(_.mode==="path"));let n=_.lookup.get(_.entryId),e=_.lookup.get(_.selectedFunctionId),a=_.mode==="path"&&n&&e?H(_.graph,n.id,e.id):null;l.route.textContent=_.mode==="path"&&n&&e?a?[n.name,...a.map(o=>_.lookup.get(o.to)?.name)].join(" \u2192 "):`${n.name} \u2192 ${e.name}: \uD655\uC778\uB41C \uACBD\uB85C \uC5C6\uC74C`:n?`\uC9C4\uC785\uC810: ${n.qualname}`:"";let t=j(l.graph,_.graph,{entryId:_.entryId,selectedFunctionId:_.selectedFunctionId,selectedCallId:_.selectedCallId,mode:_.mode,onFunction(o){I(o,_.mode),matchMedia("(max-width: 1120px)").matches&&l["evidence-heading"].focus()},onCall(o){V(o,matchMedia("(max-width: 1120px)").matches)}});l["graph-caption"].textContent=t?`\uB178\uB4DC ${t.visibleNodes} \xB7 \uC5F0\uACB0 ${t.visibleCalls}${t.truncated?" \xB7 \uC77C\uBD80\uB9CC \uD45C\uC2DC \uC911. \uD568\uC218 \uAC80\uC0C9\uC73C\uB85C \uB354 \uCC3E\uC544\uBCF4\uC138\uC694.":""} \xB7 \uC9C0\uB3C4\uAC00 \uB113\uC73C\uBA74 \uAC00\uB85C\uB85C \uC2A4\uD06C\uB864\uD558\uC138\uC694.`:""}function E(){X(),bn(),kn()}l.entry.addEventListener("change",()=>{_.entryId=l.entry.value,I(_.entryId,"overview")});l.search.addEventListener("input",X);l.overview.addEventListener("click",()=>{_.mode="overview",_.selectedCallId=null,E()});l.path.addEventListener("click",()=>{_.mode="path",_.selectedCallId=null,E()});"webkitdirectory"in l.folder||(l.folder.disabled=!0,l.folder.parentElement.setAttribute("aria-disabled","true"),l["privacy-note"].textContent="\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 \uD3F4\uB354 \uC120\uD0DD\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uACF5\uAC1C \uC608\uC81C\uB294 \uC5F4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
