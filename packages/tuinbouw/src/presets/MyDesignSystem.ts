export default {
  toast: {
    root: {
      class: ['w-96', 'opacity-90'],
    },
    container: ({ props }: any) => ({
      class: [
        'my-4 rounded-md w-full',
        {
          'bg-blue-100 border-solid border-0 border-l-4 border-blue-500 text-blue-700':
            props.message.severity == 'info',
          'bg-green-100 border-solid border-0 border-l-4 border-green-500 text-green-700':
            props.message.severity == 'success',
          'bg-orange-100 border-solid border-0 border-l-4 border-orange-500 text-orange-700':
            props.message.severity == 'warn',
          'bg-red-100 border-solid border-0 border-l-4 border-red-500 text-red-700':
            props.message.severity == 'error',
        },
      ],
    }),
    content: 'flex items-center py-5 px-7',
    icon: {
      class: ['w-6 h-6', 'text-lg mr-2'],
    },
    text: 'text-base font-normal flex flex-col flex-1 grow shrink ml-4',
    summary: 'font-bold block',
    detail: 'mt-1 block',
    closebutton: {
      class: [
        'w-8 h-8 rounded-full bg-transparent transition duration-200 ease-in-out',
        'ml-auto overflow-hidden relative',
        'flex items-center justify-center',
        'hover:bg-white/30',
      ],
    },
    transition: {
      enterFromClass: 'opacity-0 translate-x-0 translate-y-2/4 translate-z-0',
      enterActiveClass: 'transition-transform transition-opacity duration-300',
      leaveFromClass: 'max-h-40',
      leaveActiveClass: 'transition-all duration-500 ease-in',
      leaveToClass: 'max-h-0 opacity-0 mb-0 overflow-hidden',
    },
  },
  textarea: {
    root: () => ({
      class: [
        'm-0',
        'border bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 appearance-none',
        'focus:ring-primary-green-400/40 focus:ring-2',
        'hover:border-primary-green-400 hover:border-primary-green-400',
      ],
    }),
  },
  calendar: {
    root: ({ props }: any) => ({
      class: [
        'relative cursor-pointer',
        {
          'opacity-60 select-none pointer-events-none cursor-default':
            props.disabled,
        },
      ],
    }),
    input: {
      class: [
        'p-3 border border-gray-300 transition-colors duration-200 appearance-none rounded-lg',
        'hover:border-primary-green-400', //Hover
        'outline-none focus:outline-none', //Focus
      ],
    },
    dropdownButton: {
      root: {
        class: [
          'absolute right-0 top-1/2 transform -translate-y-1/2 ',
          'appearance-none h-full',
          'outline-none focus:outline-none hover:outline-none border-none ring-none',
          'text-black',
          'flex items-center justify-center',
          'pr-2',
        ],
      },
    },
    panel: ({ props }: any) => ({
      class: [
        'bg-white dark:bg-gray-900',
        'min-w-[350px]',
        {
          'shadow-md border-0 absolute': !props.inline,
          'inline-block overflow-x-auto border border-gray-300 p-2 rounded-lg':
            props.inline,
        },
      ],
    }),
    header: {
      class: [
        'flex items-center justify-between',
        'p-2 text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 font-semibold m-0 border-b border-gray-300 dark:border-blue-900/40 rounded-t-lg',
      ],
    },
    previousbutton: {
      class: [
        'flex items-center justify-center cursor-pointer overflow-hidden relative',
        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
      ],
    },
    title: 'leading-8 mx-auto',
    monthTitle: {
      class: [
        'text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2',
        'mr-2',
        'hover:text-blue-500',
      ],
    },
    yearTitle: {
      class: [
        'text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2',
        'hover:text-blue-500',
      ],
    },
    nextbutton: {
      class: [
        'flex items-center justify-center cursor-pointer overflow-hidden relative',
        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
      ],
    },
    table: {
      class: ['border-collapse w-full', 'my-2'],
    },
    tableheadercell: 'p-2',
    weekday: 'text-gray-600',
    day: 'p-2',
    daylabel: ({ context }: any) => ({
      class: [
        'w-10 h-10 rounded-full transition-shadow duration-200 border-transparent border',
        'flex items-center justify-center mx-auto overflow-hidden relative',
        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]',
        {
          'text-gray-600 opacity-60 cursor-default': context.disabled,
          'cursor-pointer': !context.disabled,
        },
        {
          'text-gray-800 bg-transparant hover:bg-primary-green-400 hover:text-white/80':
            !context.selected && !context.disabled,
          'text-white/80 bg-primary-green-400':
            context.selected && !context.disabled,
        },
      ],
    }),
    monthpicker: 'my-2',
    month: ({ context }: any) => ({
      class: [
        'w-1/3 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
        'p-2 transition-shadow duration-200 rounded-lg',
        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
        {
          'text-gray-600 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80':
            !context.selected && !context.disabled,
          'text-blue-700 bg-blue-100 hover:bg-blue-200':
            context.selected && !context.disabled,
        },
      ],
    }),
    yearpicker: {
      class: ['my-2'],
    },
    year: ({ context }: any) => ({
      class: [
        'w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
        'p-2 transition-shadow duration-200 rounded-lg',
        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
        {
          'text-gray-600 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80':
            !context.selected && !context.disabled,
          'text-blue-700 bg-blue-100 hover:bg-blue-200':
            context.selected && !context.disabled,
        },
      ],
    }),
    timepicker: {
      class: [
        'flex justify-center items-center',
        'border-t-1 border-solid border-gray-300 p-2',
      ],
    },
    separatorcontainer: 'flex items-center flex-col px-2',
    separator: 'text-xl',
    hourpicker: 'flex items-center flex-col px-2',
    minutepicker: 'flex items-center flex-col px-2',
    ampmpicker: 'flex items-center flex-col px-2',
    incrementbutton: {
      class: [
        'flex items-center justify-center cursor-pointer overflow-hidden relative',
        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
      ],
    },
    decrementbutton: {
      class: [
        'flex items-center justify-center cursor-pointer overflow-hidden relative',
        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
      ],
    },
    groupcontainer: 'flex',
    group: {
      class: [
        'flex-1',
        'border-l border-gray-300 pr-0.5 pl-0.5 pt-0 pb-0',
        'first:pl-0 first:border-l-0',
      ],
    },
    transition: {
      enterFromClass: 'opacity-0 scale-75',
      enterActiveClass:
        'transition-transform transition-opacity duration-150 ease-in',
      leaveActiveClass: 'transition-opacity duration-150 ease-linear',
      leaveToClass: 'opacity-0',
    },
  },
  dropdown: {
    root: ({ props }: any) => ({
      class: [
        'cursor-pointer relative select-none',
        'transition-colors duration-200 ease-in-out',
        'w-full',
        {
          'opacity-60 select-none pointer-events-none cursor-default':
            props.disabled,
        },
      ],
    }),
    input: ({ props }: any) => ({
      class: [
        'cursor-pointer block flex flex-auto overflow-hidden relative',
        'outline-none focus:outline-none',
        { 'pr-7': props.showClear },
      ],
    }),
    trigger: {
      class: [
        'absolute right-0 top-1/2 transform -translate-y-1/2 ',
        'rounded-lg appearance-none h-full',
        'focus:ring-primary-green-400/40 focus:ring-2',
        'text-black',
        'flex items-center justify-center',
        'pr-2',
      ],
    },
    wrapper: {
      class: [
        'max-h-[200px] overflow-auto',
        'bg-white text-gray-700 border-0 rounded-md shadow-lg',
      ],
    },
    list: {
      class: 'py-3 list-none m-0',
    },
    item: ({ context }: any) => ({
      class: [
        'cursor-pointer font-normal overflow-hidden relative whitespace-nowrap',
        'm-0 p-3 border-0  transition-shadow duration-200 rounded-none',
        {
          'text-gray-700 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800':
            !context.focused && !context.selected,
          'bg-gray-300 text-gray-700 dark:text-white/80 dark:bg-gray-800/90 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800':
            context.focused && !context.selected,
          'bg-blue-100 text-blue-700 dark:bg-blue-400 dark:text-white/80':
            context.focused && context.selected,
          'bg-blue-50 text-blue-700 dark:bg-blue-300 dark:text-white/80':
            !context.focused && context.selected,
        },
      ],
    }),
    itemgroup: {
      class: [
        'm-0 p-3 text-gray-800 bg-white font-bold',
        'dark:bg-gray-900 dark:text-white/80',
        'cursor-auto',
      ],
    },
    header: {
      class: [
        'p-3 border-b border-gray-300 text-gray-700 bg-gray-100 mt-0 rounded-tl-lg rounded-tr-lg',
        'dark:bg-gray-800 dark:text-white/80 dark:border-blue-900/40',
      ],
    },
    filtercontainer: {
      class: 'relative',
    },
    filterinput: {
      class: [
        'pr-7 -mr-7',
        'w-full',
        'font-sans text-base text-gray-700 bg-white py-3 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none',
        'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300 dark:text-white/80',
        'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
      ],
    },
    filtericon: {
      class: '-mt-2 absolute top-1/2',
    },
    clearicon: {
      class: 'text-gray-500 right-12 -mt-2 absolute top-1/2',
    },
    transition: {
      enterFromClass: 'opacity-0 scale-75',
      enterActiveClass:
        'transition-transform transition-opacity duration-150 ease-in',
      leaveActiveClass: 'transition-opacity duration-150 ease-linear',
      leaveToClass: 'opacity-0',
    },
  },
  dialog: {
    root: ({ state }: any) => ({
      class: [
        'rounded-xl shadow-lg border-0 overflow-hidden',
        'transform scale-100',
        'm-0 w-[50vw]',
        {
          'transition-none transform-none !w-screen !h-screen !max-h-full !top-0 !left-0':
            state.maximized,
        },
      ],
    }),
    header: {
      class: [
        'flex items-center justify-between shrink-0',
        'bg-white text-gray-800 border-t-0  rounded-tl-lg rounded-tr-lg p-6',
        'dark:bg-gray-900  dark:text-white/80',
      ],
    },
    headerTitle: {
      class: 'font-bold text-lg text-black capitalize',
    },
    headerIcons: {
      class: 'flex items-center',
    },
    closeButton: {
      class: [
        'flex items-center justify-center overflow-hidden relative',
        'w-8 h-8 text-black border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
        'hover:border-transparent hover:bg-gray-200',
      ],
    },
    closeButtonIcon: {
      class: 'w-4 h-4 inline-block',
    },
    content: ({ state, instance }: any) => ({
      class: [
        'overflow-y-auto',
        'bg-white text-black px-6 pb-8 pt-0',
        {
          grow: state.maximized,
        },
        {
          'rounded-bl-lg rounded-br-lg': !instance.$slots.footer,
        },
      ],
    }),
    footer: {
      class: [
        'flex gap-2 shrink-0 justify-end align-center',
        'border-t-0 bg-white text-gray-700 px-6 pb-6 text-right rounded-b-lg',
      ],
    },
    mask: ({ props }: any) => ({
      class: ['transition duration-200', { 'bg-black/40': props.modal }],
    }),
    transition: ({ props }: any) => {
      return props.position === 'top'
        ? {
            enterFromClass:
              'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0',
            enterActiveClass: 'transition-all duration-200 ease-out',
            leaveActiveClass: 'transition-all duration-200 ease-out',
            leaveToClass:
              'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0',
          }
        : props.position === 'bottom'
          ? {
              enterFromClass: 'opacity-0 scale-75 translate-y-full',
              enterActiveClass: 'transition-all duration-200 ease-out',
              leaveActiveClass: 'transition-all duration-200 ease-out',
              leaveToClass:
                'opacity-0 scale-75 translate-x-0 translate-y-full translate-z-0',
            }
          : props.position === 'left' ||
              props.position === 'topleft' ||
              props.position === 'bottomleft'
            ? {
                enterFromClass:
                  'opacity-0 scale-75 -translate-x-full translate-y-0 translate-z-0',
                enterActiveClass: 'transition-all duration-200 ease-out',
                leaveActiveClass: 'transition-all duration-200 ease-out',
                leaveToClass:
                  'opacity-0 scale-75  -translate-x-full translate-y-0 translate-z-0',
              }
            : props.position === 'right' ||
                props.position === 'topright' ||
                props.position === 'bottomright'
              ? {
                  enterFromClass:
                    'opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass:
                    'opacity-0 scale-75 opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0',
                }
              : {
                  enterFromClass: 'opacity-0 scale-75',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75',
                }
    },
  },
  inputswitch: {
    root: ({ props }: any) => ({
      class: [
        'inline-block relative',
        'w-12 h-7',
        {
          'opacity-60 select-none pointer-events-none cursor-default':
            props.disabled,
        },
      ],
    }),
    slider: ({ props }: any) => ({
      class: [
        'absolute cursor-pointer top-0 left-0 right-0 bottom-0 border border-transparent',
        'transition-colors duration-200 rounded-2xl',
        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]',
        "before:absolute before:content-'' before:top-1/2 before:bg-white before:w-5 before:h-5 before:left-1 before:-mt-2.5 before:rounded-full before:transition-duration-200",
        {
          'bg-gray-200 hover:bg-gray-300': !props.modelValue,
          'bg-primary-green-400 before:transform before:translate-x-5':
            props.modelValue,
        },
      ],
    }),
  },
  inputnumber: {
    root: 'w-fit',
    input: 'rounded-md w-20 px-2',
  },
}
