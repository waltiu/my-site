<template>
    <div class="introduce">
        <IntroduceMe class="me"></IntroduceMe>
        <div class="other">
            <IntroduceHeader class="header"></IntroduceHeader>
            <IntroduceNews class="news"></IntroduceNews>

        </div>
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

    .other {
        flex: 1;
        display: flex;
        flex-direction: column; 
        position: relative;
        box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
        .news {
            flex: 1;
        }
        .header{
            width: 100%;
            justify-content: right;
        }
    }


}
</style>