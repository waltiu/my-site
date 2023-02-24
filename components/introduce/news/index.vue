<template>
    <div class="new">
        <div v-for="item of list">
            <article class="item">
                <div class="title">{{ item.title }}</div>
                <div class="detail">
                    <div class="desc">
                        <div class="abstract">{{ item.abstract }}</div>
                        <div class="time">
                            {{ item.updateTime }}
                        </div>
                    </div>
                    <div class="cover" v-show="item.coverImg">
                        <img :src="item.coverImg" v-if="item.coverImg" />
                    </div>
                </div>

            </article>
        </div>
    </div>
</template>

<script setup ts>
import list from './constant'
</script>

<style lang="scss" scoped>
.new {
    padding: 2rem;
    background-color: #fafbff;
    padding-top: 6rem;

    .item {
        padding: 4rem 4rem;

        .title {
            color: #333;
            font-size: 26px;
            font-weight: bold;
            line-height: 1.35;
            margin-bottom: 0.25em;
        }

        .detail {
            display: flex;
            margin-right: 2rem;

            .desc {
                margin-right: 2rem;

                .abstract {
                    font-size: 1.85rem;
                    line-height: 1.625;
                    letter-spacing: .35px;
                    margin-bottom: 0.8em;
                    color: #555;
                }

                .time {
                    color: #888;
                    font-size: 14px;
                    font-size: 1.4rem;
                }
            }

            .cover {
                flex-shrink: 0;
                width: 10%;
                border-radius: 3px;
                background-size: 100%;
                background-size: cover;
                background-position: 50%;
                transition-delay: 2s;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                height: 80px;

                >img {
                    width: auto;
                    height: 100%;
                }
            }
        }


    }

}
</style>