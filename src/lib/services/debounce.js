
export default function debounce(func, wait) {
    let timeout;

    const debouncedFunction = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };  
    
    debouncedFunction.cancel = () => {
        clearTimeout(timeout);
    }

    return debouncedFunction;
}