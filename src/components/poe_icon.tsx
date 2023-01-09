import { useState } from "react"
import Image from "next/image"
import { truncateFloat } from "../utils"

const POE_ICON_SIZE = 96

export const CHAOS_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png"

export const DIVINE_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png"

export type PoeIconProps = {
    icon: string
    alt: string
    className?: string
    size: number
}

const PoeIcon = ({ icon, alt, className, size }: PoeIconProps) => {
    return (
        <Image
            src={icon.replace(/\?.*$/, "")}
            alt={alt}
            className={`inline-block ${className}`}
            style={{
                height: size,
                width: size,
            }}
            width={POE_ICON_SIZE}
            height={POE_ICON_SIZE}
        />
    )
}

export default PoeIcon

export const ChaosIcon = (props: Omit<PoeIconProps, "icon" | "alt">) => {
    return <PoeIcon {...props} icon={CHAOS_ICON} alt="Chaos Orb" />
}

export const DivineIcon = (props: Omit<PoeIconProps, "icon" | "alt">) => {
    return <PoeIcon {...props} icon={DIVINE_ICON} alt="Divine Orb" />
}

type PriceTextProps = {
    className?: string
    textClassName?: string
    amount: number
    size: number
    places?: number
}

export const DivinePrice = ({
    className,
    textClassName,
    size,
    amount,
    places = 3,
}: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span className={textClassName} style={{ fontSize: size }}>
                {truncateFloat(amount, places)}&nbsp;
            </span>
            <DivineIcon size={Math.floor(size)} />
        </div>
    )
}

export const ChaosPrice = ({
    className,
    textClassName,
    size,
    amount,
    places = 3,
}: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span className={textClassName} style={{ fontSize: size }}>
                {truncateFloat(amount, places)}&nbsp;
            </span>
            <ChaosIcon size={Math.floor(size)} />
        </div>
    )
}

type PoeIconTextProps = {
    iconProps: PoeIconProps
    text: string
    secondary?: React.ReactNode
}

export const PoeIconText = ({ iconProps, text, secondary }: PoeIconTextProps) => {
    return (
        <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center">
                <PoeIcon {...iconProps} />
            </div>
            {secondary ? (
                <div className="ml-4">
                    <div className="font-medium text-gray-900">{text}</div>
                    {typeof secondary === "string" ? (
                        <div className="text-xs text-gray-500">{secondary}</div>
                    ) : (
                        secondary
                    )}
                </div>
            ) : (
                <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">{text}</div>
                </div>
            )}
        </div>
    )
}

type TogglePriceProps = {
    className?: string
    divineValue: number
    chaosValue: number
    size: number
}

export const TogglePrice = ({ className, divineValue, chaosValue, size }: TogglePriceProps) => {
    const [showDivine, setShowDivine] = useState(true)

    return (
        <div
            onClick={() => {
                setShowDivine(!showDivine)
            }}
        >
            {showDivine ? (
                <DivinePrice className={className} amount={divineValue} size={size} />
            ) : (
                <ChaosPrice className={className} amount={chaosValue} size={size} />
            )}
        </div>
    )
}
