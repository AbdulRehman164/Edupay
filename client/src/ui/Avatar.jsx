function Avatar({ name, size = 'h-8 w-8', dynamicColor = true }) {
    const initials = (name ?? '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();

    const hue =
        [...(name ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

    return (
        <div
            style={
                dynamicColor
                    ? {
                          background: `hsl(${hue},45%,88%)`,
                          color: `hsl(${hue},45%,35%)`,
                      }
                    : undefined
            }
            className={`
                ${size}
                rounded-full
                flex items-center justify-center
                text-xs font-bold
                flex-shrink-0 select-none
                ${
                    !dynamicColor
                        ? 'bg-white/15 text-white border-[1.5px] border-white/25'
                        : ''
                }
            `}
        >
            {initials}
        </div>
    );
}

export default Avatar;
