import { ref, onMounted, onUnmounted } from 'vue'
/**
 * 使用窗口宽度的自定义钩子。
 * @param {string} [size] - 可选的尺寸，可以是 'xs', 'sm', 'md', 'lg', 'xl'。
 * @returns {ref} - 响应式的宽度值。
 */
export function useWindowWidth(size) {
    const sizeMap = {
        xs: 768, // <768
        sm: 768, // >=768
        md: 992, // >=992
        lg: 1200, // >=1200
        xl: 1920, // >=1920
    }
    const width = ref(null)
    if (!sizeMap.hasOwnProperty(size) && size !== undefined) {
        console.log('不存在该尺寸!')
    }
    const updateWidth = () => {
        if (sizeMap.hasOwnProperty(size)) {
            if (size === "xs") {
                width.value = window.innerWidth < sizeMap[size]
            } else {
                width.value = window.innerWidth >= sizeMap[size]
            }
        } else {
            width.value = window.innerWidth
        }
    }
    updateWidth()
    // 组件挂载时添加监听器
    onMounted(() => {
        window.addEventListener('resize', updateWidth)
    })
    // 组件卸载时移除监听器
    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })

    return width
}