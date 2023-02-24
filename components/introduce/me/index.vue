<template>
    <div class="me">
        <div class="portrait">
            <img src="~/assets/introduce/portrait.png" alt="11" />
        </div>
        <h1 class="user"> Waltiu's Blog </h1>
        <div class="link-icons">
            <div v-for="item of linkIcons" key="item.name" class="item">
                <img :src="item.icon" />
                <div class="text">
                    {{ item.name }}
                </div>
            </div>
        </div>
        <div class="desc">&nbsp; &nbsp;&nbsp;&nbsp;{{ descText }} </div>
        <div class="site-info">
            <div>
                © waltiu's Blog 2023 - today
            </div>
            <div>
                Powered by nuxt.js. Designed and developed by waltiu.

            </div>
        </div>
    </div>
</template>

<script setup>
import { linkIcons } from '~/constant'
import { descText } from './constant'

</script>

<style lang="scss" scoped>
.me {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("~/assets/introduce/me/backImgs/1.jpg") no-repeat;
    background-size: 100% 100%;

    .portrait {
        margin-top: 12em;

        >img {
            width: 100px;
            height: 100px;
            margin-top: 5px;
            margin-bottom: 10px;
            border-radius: 100%;
            box-shadow: 0 0 0 2px rgb(255 255 255 / 50%), 0px 2px 20px 3px rgb(0 0 0 / 25%);
        }
    }

    .user {
        font-size: 1.6rem;
        margin-top: 0.375em;
        color: rgba(255, 255, 255, 0.7);
    }

    .link-icons {
        display: flex;

        >.item {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            color: rgba(255, 255, 255, 0.8);

            img {
                width: 16px;
                height: 16px;
                position: relative;
                display: inline-block;
                border: 1px solid;
                border-color: rgba(255, 255, 255, 0.35) rgba(255, 255, 255, 0.45) rgba(255, 255, 255, 0.55);
                border-radius: 100%;
                padding: 6px;
                margin: 0 0.25em;
                font-size: 12px;
                font-size: 1.2rem;
                letter-spacing: .5px;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 3px 18px rgb(0 0 0 / 20%);
                transition: .2s;
                cursor: pointer;
            }

            .text {
                position: absolute;
                display: none;
                margin-top: 2px;
                bottom: -24px;
                font-size: 12px;
                width: fit-content;
            }

            &:hover {
                .text {
                    display: block;
                }
            }
        }
    }

    .desc {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.5;
        width: 76%;
        margin-top: 2rem;
        color: dimgray;
    }

    .site-info {
        position: absolute;
        text-align: center;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.75);
        bottom: 2rem;
        font-size: 0.5rem;
    }
}
</style>