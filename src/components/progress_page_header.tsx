import { Fragment } from "react"
import { ShareIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import classNames from "classnames"
import { Menu, Transition } from "@headlessui/react"
import Spinner from "./spinner"

type ProgressPageHeaderProps = {
    isFetching: boolean
}

export default function ProgressPageHeader({ isFetching }: ProgressPageHeaderProps) {
    return (
        <div className="bg-crust p-4 lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <h2 className="pl-4 text-2xl font-bold leading-7 text-subtext1 sm:truncate sm:text-3xl sm:tracking-tight">
                    Are We There Yet?
                    {isFetching && (
                        <Spinner className="relative -top-1 ml-4 inline-block !h-6 !w-6" />
                    )}
                </h2>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
                <span className="sm:ml-3">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-peach px-4 py-2 text-sm font-medium text-mantle shadow-sm focus:outline-none focus:ring-2 focus:ring-peach focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <ShareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Share
                    </button>
                </span>

                {/* Dropdown */}
                <Menu as="div" className="relative ml-3 sm:hidden">
                    <Menu.Button className="inline-flex items-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        More
                        <ChevronDownIcon
                            className="-mr-1 ml-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-0 z-10 mt-2 -ml-1 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                    >
                                        View
                                    </a>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    )
}
