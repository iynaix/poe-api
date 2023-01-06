import React from "react"

type InputProps = {
    name: string
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
} & (
    | {
          type: "number"
          value: number
      }
    | {
          type: "text"
          value: string
      }
)

const Input = ({ name, type = "text", value, onChange }: InputProps) => {
    return (
        <input
            className="text-gray-850 block w-20 rounded-md shadow-sm bg-gray-100 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...(type === "number" ? { min: 0 } : {})}
            min={0}
        />
    )
}

export default Input
