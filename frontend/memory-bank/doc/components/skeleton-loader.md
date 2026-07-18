# SkeletonLoader

Animated loading placeholder (CSS-only, GPU-accelerated, no dependencies).

`import SkeletonLoader from '@brugmann/vuemann/src/components/SkeletonLoader.vue'`

**Props:** `width` (String, '100%'), `height` (String, '20px') — any CSS value

```vue
<SkeletonLoader />
<SkeletonLoader width="60%" height="32px" />
```

Best practices: use dimensions close to final content, display 3-5 skeletons, replace ASAP.
