export function BackgroundLayer() {
    return (
        <>
            <defs>
                <pattern
                    id="smallGrid"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M 8 0 L 0 0 0 8"
                        fill="none"
                        stroke="gray"
                        strokeWidth="0.5"
                    />
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path
                        d="M 80 0 L 0 0 0 80"
                        fill="none"
                        stroke="gray"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect width="5000%" height="5000%" fill="url(#grid)" x="-2500%" y="-2500%" />
        </>
    );
}
