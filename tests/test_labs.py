"""
Integration and regression test suite for Weight-Space Programming (WSP) labs.
Ensures zero-dependency experiments run seamlessly on Python 3.8+ and NumPy 1.x / 2.x.
"""
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LAB_DIR = REPO_ROOT / "lab"


def test_lab_01_compile_a_rule():
    """Verify Lab 1 hand-compiled rule runs and asserts pass."""
    script_path = LAB_DIR / "01_compile_a_rule.py"
    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
        check=True
    )
    assert "all asserts passed" in result.stdout
    assert "17-number brain plays paddle" in result.stdout


def test_lab_02_direction_surgery():
    """Verify Lab 2 rank-1 direction projection surgery runs without error."""
    script_path = LAB_DIR / "02_direction_surgery.py"
    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
        check=True
    )
    assert "max |u^T W'|" in result.stdout
    assert "remaining u-energy" in result.stdout


def test_lab_03_blast_radius():
    """Verify Lab 3 sparsity arithmetic matches 0.0164% and 131,072 params."""
    script_path = LAB_DIR / "03_blast_radius.py"
    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
        check=True
    )
    assert "0.0164%" in result.stdout
    assert "131072" in result.stdout

