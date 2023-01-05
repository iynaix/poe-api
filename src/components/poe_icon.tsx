import Image from "next/image"
import { truncateFloat } from "../utils"

export const CHAOS_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png"

export const DIVINE_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png"

export type PoeIconProps = {
    icon: string
    alt: string
    className?: string
    size: number
}

// const whClassName = (size: number) => `h-[${size}px] w-[${size}px]`

const PoeIcon = ({ icon, alt, className, size }: PoeIconProps) => {
    const whClassName = `h-[${size}px] w-[${size}px]`

    return (
        <Image
            src={icon.replace(/\?.*$/, "")}
            alt={alt}
            className={`inline-block ${whClassName} ${className}`}
            width={size}
            height={size}
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
    amount: number
    size: number
    places?: number
}

export const DivinePrice = ({ className, size, amount, places = 3 }: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span style={{ fontSize: size }}>{truncateFloat(amount, places)}&nbsp;</span>
            <DivineIcon size={Math.floor(size)} />
        </div>
    )
}

export const ChaosPrice = ({ className, size, amount, places = 3 }: PriceTextProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <span style={{ fontSize: size }}>{truncateFloat(amount, places)}&nbsp;</span>
            <ChaosIcon size={Math.floor(size)} />
        </div>
    )
}

type PoeIconTextProps = {
    iconProps: PoeIconProps
    text: string
    secondaryText?: string
}

export const PoeIconText = ({ iconProps, text, secondaryText }: PoeIconTextProps) => {
    return (
        <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center">
                <PoeIcon {...iconProps} />
            </div>
            {secondaryText ? (
                <div className="ml-4">
                    <div className="font-medium text-gray-900">{text}</div>
                    <div className="text-xs text-gray-500">{secondaryText}</div>
                </div>
            ) : (
                <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">{text}</div>
                </div>
            )}
        </div>
    )
}
