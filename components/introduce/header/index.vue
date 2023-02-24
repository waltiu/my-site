<template>
    <div class="header">
        <div>Projects</div>
        <div>Notes</div>
        <div>Notes</div>
        <div>Collections</div>
        <div>Contact</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.header {
    display: flex;
    position: absolute;
    top: 0px;
    right: 1rem;
    padding: 2rem;

    >div {
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        transition: opacity .2s ease;
        opacity: 0.5;
        outline: none;
        color: rgb(55, 65, 81);
        font-size: 1.6rem;

        &:hover {
            opacity: 1;

        }

        margin-right: 2rem;
    }
}</style>