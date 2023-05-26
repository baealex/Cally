import { useState } from 'react';

interface ToggleProp {
    defaultChecked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

export const Toggle = ({
    defaultChecked,
    onChange,
    children,
    className
}: ToggleProp) => {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <>
            <div
                className={`toggle ${className} ${checked && 'active'}`}
                onClick={() => {
                    setChecked(!checked);
                    onChange(!checked);
                }}>
                <div className="toggle-item"></div>
            </div>
            {children}
            <style jsx>{`
                .toggle {
                    width: 40px;
                    height: 20px;
                    border-radius: 10px;
                    background: #ccc;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .toggle.active {
                    background: #2ecc71;
                }
          
                .toggle-item {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #fff;
                    margin-left: 2px;
                    transition: margin-left 0.2s ease;
                }
          
                .toggle.active .toggle-item {
                    margin-left: 22px;
                }
            `}</style>
        </>
    );
};