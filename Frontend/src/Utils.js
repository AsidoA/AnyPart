import React, { useEffect } from 'react';

const AnimatedIcon = ({ src, trigger,colors, style }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.lordicon.com/lordicon.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <lord-icon
                src={src}
                trigger={trigger}
                colors={colors}
                style={style}
            />
        </div>
    );
};

export const createAnimatedIcon = (src, trigger, colors, style) => {
    return <AnimatedIcon src={src} trigger={trigger} colors={colors} style={style} />;
};