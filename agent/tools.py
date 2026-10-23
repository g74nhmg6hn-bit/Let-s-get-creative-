"""Tools the agent can call.

Each tool is a plain Python function wrapped with ``@beta_tool``. The SDK builds
the JSON schema from the type hints and the docstring's ``Args:`` section, so
the docstring is what Claude reads when deciding whether to call the tool.

To add a tool: write a function here, decorate it, and append it to ``TOOLS``.
Raise ``ToolError`` for failures Claude should see and recover from.
"""

from __future__ import annotations

import ast
import math
import operator
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from anthropic import beta_tool
from anthropic.lib.tools import ToolError

# File tools can only touch paths inside this directory.
WORKSPACE = Path(os.environ.get("AGENT_WORKSPACE", "workspace")).resolve()

MAX_READ_CHARS = 100_000


def _resolve_in_workspace(path: str) -> Path:
    """Resolve ``path`` relative to the workspace, refusing anything outside it."""
    target = (WORKSPACE / path).resolve()
    if not target.is_relative_to(WORKSPACE):
        raise ToolError(f"Path '{path}' is outside the workspace.")
    return target


_BIN_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}
_UNARY_OPS = {ast.UAdd: operator.pos, ast.USub: operator.neg}
_FUNCS = {
    name: getattr(math, name)
    for name in ("sqrt", "log", "log10", "exp", "sin", "cos", "tan", "floor", "ceil")
}
_FUNCS.update(abs=abs, round=round)
_CONSTS = {"pi": math.pi, "e": math.e}


def _eval_node(node: ast.AST) -> float:
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.Name) and node.id in _CONSTS:
        return _CONSTS[node.id]
    if isinstance(node, ast.BinOp) and type(node.op) in _BIN_OPS:
        if isinstance(node.op, ast.Pow) and abs(_eval_node(node.right)) > 1000:
            raise ToolError("Exponent too large.")
        return _BIN_OPS[type(node.op)](_eval_node(node.left), _eval_node(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _UNARY_OPS:
        return _UNARY_OPS[type(node.op)](_eval_node(node.operand))
    if (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id in _FUNCS
        and not node.keywords
    ):
        return _FUNCS[node.func.id](*(_eval_node(arg) for arg in node.args))
    raise ToolError(f"Unsupported expression element: {ast.dump(node)}")


@beta_tool
def calculate(expression: str) -> str:
    """Evaluate an arithmetic expression exactly and return the result.

    Supports + - * / // % ** and parentheses, the constants pi and e, and the
    functions sqrt, log, log10, exp, sin, cos, tan, floor, ceil, abs, round.

    Args:
        expression: The expression to evaluate, e.g. "sqrt(2) * (3 + 4) ** 2".
    """
    try:
        tree = ast.parse(expression, mode="eval")
        return str(_eval_node(tree.body))
    except SyntaxError as exc:
        raise ToolError(f"Invalid expression: {exc.msg}") from exc
    except (ArithmeticError, ValueError) as exc:
        raise ToolError(f"Math error: {exc}") from exc


@beta_tool
def current_time(timezone: str = "UTC") -> str:
    """Get the current date and time.

    Args:
        timezone: IANA timezone name, e.g. "Europe/Paris" or "America/New_York".
    """
    try:
        tz = ZoneInfo(timezone)
    except (ZoneInfoNotFoundError, ValueError) as exc:
        raise ToolError(f"Unknown timezone '{timezone}'.") from exc
    return datetime.now(tz).strftime("%A, %Y-%m-%d %H:%M:%S %Z")


@beta_tool
def list_files(directory: str = ".") -> str:
    """List files and folders in the agent's workspace.

    Args:
        directory: Folder to list, relative to the workspace root.
    """
    target = _resolve_in_workspace(directory)
    if not target.is_dir():
        raise ToolError(f"'{directory}' is not a directory.")
    entries = sorted(target.iterdir(), key=lambda p: (not p.is_dir(), p.name))
    if not entries:
        return "(empty)"
    return "\n".join(f"{p.name}/" if p.is_dir() else p.name for p in entries)


@beta_tool
def read_file(path: str) -> str:
    """Read a text file from the agent's workspace.

    Args:
        path: File path relative to the workspace root.
    """
    target = _resolve_in_workspace(path)
    if not target.is_file():
        raise ToolError(f"File '{path}' does not exist.")
    try:
        text = target.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise ToolError(f"'{path}' is not a UTF-8 text file.") from exc
    if len(text) > MAX_READ_CHARS:
        return text[:MAX_READ_CHARS] + f"\n\n[truncated: file is {len(text)} characters]"
    return text


@beta_tool
def write_file(path: str, content: str) -> str:
    """Create or overwrite a text file in the agent's workspace.

    Args:
        path: File path relative to the workspace root. Parent folders are created.
        content: The full text to write.
    """
    target = _resolve_in_workspace(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    return f"Wrote {len(content)} characters to {target.relative_to(WORKSPACE)}."


TOOLS = [calculate, current_time, list_files, read_file, write_file]
