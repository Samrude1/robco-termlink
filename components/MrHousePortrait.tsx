import React, { useMemo } from 'react';

interface MrHousePortraitProps {
    mood: 'NEUTRAL' | 'AMUSED' | 'ANNOYED' | 'CALCULATING';
}

const MrHousePortrait: React.FC<MrHousePortraitProps> = ({ mood }) => {
    // We represent the face as a 32x32 grid string, where '.' is empty and '#' is a pixel.
    // This allows us to "draw" the face in code without external assets.

    const getFaceData = (mood: string) => {
        // Base head shape (very simplified 8-bit style)
        // 01234567890123456789012345678901
        const base = [
            "................................",
            "...........########.............",
            ".........##........##...........",
            ".......##............##.........",
            "......#................#........",
            ".....#..................#.......",
            ".....#.......####.......#.......",
            ".....#......######......#.......",
            ".....#.....########.....#.......", // Forehead
            ".....#.....########.....#.......",
            ".....#..................#.......",
        ];

        let eyes = [];
        let mouth = [];

        switch (mood) {
            case 'ANNOYED':
                eyes = [
                    ".....#...##........##...#.......", // Furrowed brow
                    ".....#....#........#....#.......",
                    ".....#...#..........#...#.......",
                ];
                mouth = [
                    ".....#..................#.......",
                    ".....#.......####.......#.......", // Frown
                    ".....#......#....#......#.......",
                ];
                break;
            case 'AMUSED':
                eyes = [
                    ".....#..................#.......",
                    ".....#...##........##...#.......",
                    ".....#...##........##...#.......",
                ];
                mouth = [
                    ".....#......#....#......#.......", // Smile
                    ".....#.......####.......#.......",
                    ".....#..................#.......",
                ];
                break;
            case 'CALCULATING':
                eyes = [
                    ".....#..................#.......",
                    ".....#...##........##...#.......", // Eyes
                    ".....#...##........##...#.......",
                ];
                mouth = [
                    ".....#.......####.......#.......", // Flat line
                    ".....#..................#.......",
                    ".....#..................#.......",
                ];
                break;
            default: // NEUTRAL
                eyes = [
                    ".....#..................#.......",
                    ".....#...##........##...#.......",
                    ".....#...##........##...#.......",
                ];
                mouth = [
                    ".....#.......####.......#.......",
                    ".....#..................#.......",
                    ".....#..................#.......",
                ];
                break;
        }

        const chin = [
            ".....#..................#.......",
            "......#................#........",
            ".......##............##.........",
            ".........##........##...........",
            "...........########.............",
            "................................",
        ];

        return [...base, ...eyes, ...mouth, ...chin];
    };

    const faceGrid = useMemo(() => getFaceData(mood), [mood]);

    return (
        <div className="w-32 h-32 md:w-48 md:h-48 relative bg-[#001100] border-2 border-[#1aff1a] mb-4 flex flex-col items-center justify-center p-1 overflow-hidden shadow-[0_0_10px_var(--pip-green)]">
            {/* Scanline overlay for the face specifically */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20 opacity-50"></div>

            {/* The Pixel Grid */}
            <div className="grid grid-cols-[repeat(32,1fr)] w-full h-full gap-0 z-10">
                {faceGrid.map((row, y) => (
                    row.split('').map((pixel, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`${pixel === '#' ? 'bg-[#1aff1a] shadow-[0_0_2px_#1aff1a]' : 'bg-transparent'} w-full h-full`}
                        />
                    ))
                ))}
            </div>

            {/* Calculating Animation Overlay */}
            {mood === 'CALCULATING' && (
                <div className="absolute inset-0 bg-[#1aff1a] opacity-10 animate-pulse z-30"></div>
            )}
        </div>
    );
};

export default MrHousePortrait;
