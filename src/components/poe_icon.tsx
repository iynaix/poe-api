import Image from "next/image"

export const CHAOS_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png"

export const DIVINE_ICON = "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png"

const POE_ICON_SIZE = 48

type PoeIconProps = {
    icon: string
    alt: string
    className?: string
    size?: number
}

const PoeIcon = ({ icon, alt, className, size = POE_ICON_SIZE }: PoeIconProps) => {
    return (
        <Image
            src={icon.replace(/\?.*$/, "")}
            alt={alt}
            className={`inline-block ${className}`}
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
