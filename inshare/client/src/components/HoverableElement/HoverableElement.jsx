import React, { useState } from 'react';

function HoverableElement({ children }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const elementStyle = {
        color: isHovered ? '#F16236' : 'Black',
        // Add other CSS properties as needed
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={elementStyle}
        >
            {children}
        </div>
    );
}

export default HoverableElement;
