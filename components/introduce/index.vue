<template>
    <div class="introduce">
        <IntroduceMe class="me"></IntroduceMe>
        <IntroduceLatest class="latest"></IntroduceLatest>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.introduce {
    display: flex;
    height: 100%;

    .me {
        width: 40%;
        flex-shrink: 0;
    }

    .latest {
        flex: 1;
    }

}
</style>