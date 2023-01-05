import { Fragment, useState } from "react"
import { Combobox, Dialog, Transition } from "@headlessui/react"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import Spinner from "./spinner"
import { trpc } from "../utils/trpc"
import { DivinePrice, PoeIconText } from "./poe_icon"
import { type Price } from "../server/trpc/router/prices"
import { usePriceStore } from "../utils/progress_stores"

function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(" ")
}

type SearchModalProps = {
    open: boolean
    setOpen: (open: boolean) => void
    onSelect: (price: Price) => void
}

export default function SearchPalette({ open, setOpen, onSelect }: SearchModalProps) {
    const { add: addPrice } = usePriceStore()

    const [query, setQuery] = useState("")

    const { data: prices, isLoading } = trpc.prices.byName.useQuery({ query })

    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery("")} appear>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-opacity-25 transition-opacity bg-slate-400" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 transition-all bg-white">
                            <Combobox
                                onChange={(price: Price) => {
                                    onSelect(price)
                                    addPrice(price.id, price)
                                    setOpen(false)
                                }}
                            >
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 pl-11 pr-4 placeholder-gray-400 bg-transparent text-gray-800 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>

                                {!isLoading && query.length >= 3 && prices?.length === 0 && (
                                    <div className="py-14 px-6 text-center text-sm sm:px-14">
                                        <ExclamationCircleIcon
                                            type="outline"
                                            name="exclamation-circle"
                                            className="mx-auto h-6 w-6 text-gray-400"
                                        />
                                        <p className="mt-4 font-semibold text-gray-900">
                                            No results found
                                        </p>
                                    </div>
                                )}

                                {isLoading || !prices ? (
                                    <div className="flex items-center justify-center p-5">
                                        <Spinner />
                                    </div>
                                ) : (
                                    prices.length > 0 && (
                                        <Combobox.Options
                                            static
                                            className="max-h-96 scroll-py-3 overflow-y-auto p-3"
                                        >
                                            {prices.map((price) => (
                                                <Combobox.Option
                                                    key={price.id}
                                                    value={price}
                                                    className={({ active }) =>
                                                        classNames(
                                                            "flex cursor-default select-none rounded-xl p-3",
                                                            active && "bg-gray-100"
                                                        )
                                                    }
                                                >
                                                    {() => (
                                                        <div className="flex flex-1 items-center">
                                                            <PoeIconText
                                                                text={price.name}
                                                                secondaryText={price.id}
                                                                iconProps={{
                                                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                                    icon: price.icon!,
                                                                    alt: price.name,
                                                                    size: 30,
                                                                }}
                                                            />
                                                            <div className="ml-auto">
                                                                <DivinePrice
                                                                    amount={price.divineValue}
                                                                    size={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Combobox.Option>
                                            ))}
                                        </Combobox.Options>
                                    )
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
