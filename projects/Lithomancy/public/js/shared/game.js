// ─── Stone faces ─────────────────────────────────────────────────────────────
export const SHAPES = ["triangle", "square", "pentagon", "hexagon", "octagon"];
export const STAR_VALUES = [4, 5, 8, 9, 10];
export const SHAPE_SIDES = {
    triangle: 3,
    square: 4,
    pentagon: 5,
    hexagon: 6,
    octagon: 8,
};
export function rollStone() {
    if (Math.random() < 0.5) {
        return { kind: "shape", value: SHAPES[Math.floor(Math.random() * SHAPES.length)] };
    }
    else {
        return { kind: "star", value: STAR_VALUES[Math.floor(Math.random() * STAR_VALUES.length)] };
    }
}
export function rollHand() {
    return Array.from({ length: 5 }, () => rollStone());
}
export function rollSelectedStones(hand, indices) {
    return hand.map((stone, i) => (indices.includes(i) ? rollStone() : stone));
}
export function classifyCast(hand) {
    const shapes = hand.filter((f) => f.kind === "shape");
    const stars = hand.filter((f) => f.kind === "star");
    const sc = shapes.length;
    const stc = stars.length;
    if (sc === 5)
        return { type: "bungle", hand };
    if (sc === 4) {
        const potionValue = stars[0]?.value;
        if (potionValue === undefined)
            return { type: "bungle", hand };
        return { type: "potion", hand, potionValue };
    }
    if (stc === 5)
        return { type: "bungle", hand };
    if (stc === 4) {
        const charmValue = shapes[0]?.value;
        if (!charmValue)
            return { type: "bungle", hand };
        return { type: "charm", hand, charmValue };
    }
    if (sc === 3 && stc === 2) {
        const spellValue = stars.reduce((s, f) => s + f.value, 0);
        return { type: "spell", hand, spellValue };
    }
    // sc === 2 && stc === 3
    return { type: "bungle", hand };
}
/**
 * Returns winner index (0 or 1) or 'draw'.
 * Assumes both casts are finalised.
 */
export function resolveTurn(a, b) {
    const ta = normalisedType(a.type);
    const tb = normalisedType(b.type);
    // Bungle loses to everything
    if (ta === "bungle" && tb === "bungle")
        return { winner: "draw", reason: "Both bungled" };
    if (ta === "bungle")
        return { winner: 1, reason: "⍺ bungled" };
    if (tb === "bungle")
        return { winner: 0, reason: "Ω bungled" };
    // Rock-paper-scissors: spell > potion > charm > spell
    if (ta !== tb) {
        if (beats(ta, tb))
            return { winner: 0, reason: `${ta} beats ${tb}` };
        return { winner: 1, reason: `${tb} beats ${ta}` };
    }
    // Same category — tiebreak
    if (ta === "spell") {
        const av = a.spellValue ?? 0;
        const bv = b.spellValue ?? 0;
        if (av > bv)
            return { winner: 0, reason: `Spell ${av} vs ${bv}` };
        if (bv > av)
            return { winner: 1, reason: `Spell ${bv} vs ${av}` };
        return { winner: "draw", reason: `Spell tie ${av}` };
    }
    if (ta === "potion") {
        // Both are potions — compare star value.
        const av = a.potionValue ?? 0;
        const bv = b.potionValue ?? 0;
        if (av > bv)
            return { winner: 0, reason: `Potion ${av} vs ${bv}` };
        if (bv > av)
            return { winner: 1, reason: `Potion ${bv} vs ${av}` };
        return { winner: "draw", reason: `Potion tie` };
    }
    if (ta === "charm") {
        const av = SHAPE_SIDES[a.charmValue ?? "triangle"];
        const bv = SHAPE_SIDES[b.charmValue ?? "triangle"];
        if (av > bv)
            return { winner: 0, reason: `Charm ${a.charmValue} vs ${b.charmValue}` };
        if (bv > av)
            return { winner: 1, reason: `Charm ${b.charmValue} vs ${a.charmValue}` };
        return { winner: "draw", reason: `Charm tie` };
    }
    return { winner: "draw", reason: "Unknown" };
}
function normalisedType(t) {
    if (t === "spell")
        return "spell";
    if (t === "potion")
        return "potion";
    if (t === "charm")
        return "charm";
    return "bungle";
}
function beats(a, b) {
    return (a === "spell" && b === "potion") || (a === "potion" && b === "charm") || (a === "charm" && b === "spell");
}
export function initialBoard() {
    return Array(8).fill(null);
}
export function checkWin(board) {
    for (let p = 0; p <= 1; p++) {
        const owner = p;
        for (let start = 0; start < 8; start++) {
            let win = true;
            for (let k = 0; k < 4; k++) {
                if (board[(start + k) % 8] !== owner) {
                    win = false;
                    break;
                }
            }
            if (win)
                return owner;
        }
    }
    return null;
}
// Are turrets i and j adjacent on the ring of 8?
export function areAdjacent(i, j) {
    return Math.abs(i - j) === 1 || Math.abs(i - j) === 7;
}
