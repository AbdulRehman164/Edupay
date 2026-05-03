function inputClass(error) {
    return [
        'w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all bg-white',
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100',
    ].join(' ');
}

export default inputClass;
