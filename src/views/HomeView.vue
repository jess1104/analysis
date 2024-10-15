<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useDataStore } from "@/stores/useDataStore";
import { useRoute } from "vue-router"; // Uncomment this line
import S4Mobile from "@/components/S4Mobile.vue";
import S4Desktop from "@/components/S4Desktop.vue";
import S5Desktop from "@/components/S5Desktop.vue";
// import S5Mobile from "@/components/S5Mobile.vue";
const route = useRoute(); // Add this line
// const router = useRouter();
const store = useDataStore();
// console.log('routes', route.params);
const id = ref(null);
const participantName = ref({});
const hasData = ref(true); // api 是否有資料
const isExpand = ref(false); // 是否展開歷史資料

const historyConatiner = ref(null);

const matchVictory = computed(() => store.matchVictory);
const winLoseConfig = {
  0: "輸",
  1: "贏",
  2: "平",
};

const isLoading = computed(() => store.isLoading);
const startTime = computed(() => store.startTime);
const leagueName = computed(() => store.leagueName);
const homeName = computed(() => store.homeName);
const awayName = computed(() => store.awayName);
const sportName = computed(() => store.sportName);
const maxWin = computed(() => store.maxWin);
const totalAvg = computed(() => store.totalAvg);
const ranks = computed(() => store.ranks);
const historyWin = computed(() => store.historyWin);
const matchHistory = computed(() => store.matchHistory);
const matchTeamHis = computed(() => store.matchTeamHis);
const matchFuture = computed(() => store.matchFuture);

onMounted(async () => {
  const dataStore = useDataStore();
  const { leagueId, homeId, awayId, scheduleTimeStr } = route.query;

  if (leagueId) {
    dataStore.setLeagueId(leagueId);
  }
  if (homeId) {
    dataStore.setHomeId(homeId);
  }
  if (awayId) {
    dataStore.setAwayId(awayId);
  }
  if (scheduleTimeStr) {
    dataStore.setStartTime(scheduleTimeStr);
  }

  // 設置 loading 狀態
  dataStore.setLoading(true);
  try {
    await Promise.all([dataStore.fetchLeagueName(leagueId), dataStore.fetchParticipantsName(homeId, awayId), dataStore.fetchMatchVictory(homeId, awayId), dataStore.fetchMaxWin(homeId, awayId), dataStore.fetchTotalAvg(leagueId, homeId, awayId), dataStore.fetchRank(leagueId, homeId, awayId), dataStore.fetchHistoryWin(homeId, awayId), dataStore.fetchMatchHistory(homeId, awayId), dataStore.fetchMatchTeamHis(homeId, awayId), dataStore.fetchMatchFuture(homeId, awayId), dataStore.fetchOverUnder(leagueId, homeId, awayId)]).catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error fetching Promise data:", error);
    dataStore.setLoading(false);
    hasData.value = false;
    // router.push({ name: "NoDataPage" });
  } finally {
    // 關閉 loading 狀態
    dataStore.setLoading(false);
  }
});

watch(
  () => isExpand.value,
  (newVal) => {
    if (!newVal && historyConatiner.value) {
      // 程序化滚动到顶部
      historyConatiner.value.scrollTop = 0;
    }
  }
);
// 中間圈圈百分比
function formatHistoryWin() {
  return (historyWin.value.participant2.history_win / historyWin.value.total_history_record) * 100;
}

// 加時/完賽簡化
function formatStatusName(name) {
  const match = name.match(/overtime/);
  if (match) {
    return match[0];
  } else if (name === "Finished after extra inning") {
    return "overtime";
  } else {
    return name;
  }
}

// 百分條字體位置
function calcText(side) {
  if (side === "left") {
    return `calc(${parseInt(matchHistory.value.participant1.win_rate) / 2}% - 24px)`;
  }
  if (side === "right") {
    return `calc(${matchHistory.value.participant1.win_rate} + ${matchHistory.value.draw.rate} + ${parseInt(matchHistory.value.participant2.win_rate) / 2}% - 24px)`;
  }

  return `calc(${matchHistory.value.participant1.win_rate} + ${parseInt(matchHistory.value.draw.rate) / 2}% - 24px)`;
}

// onMounted(async () => {
//   id.value = route.params.id;
// });
</script>

<template>
  <v-progress-circular v-if="isLoading && hasData" :size="70" :width="7" indeterminate color="primary" :style="{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }"></v-progress-circular>
  <div v-else-if="!isLoading && hasData" class="contain">
    <header>{{ sportName }}/{{ leagueName }}{{ id }}</header>
    <main>
      <section class="s1">
        <div class="s1-league title">{{ leagueName }}</div>
        <div class="s1-teams title">
          <div class="team">
            <!-- <img src="./assets/default.png" alt="" /> -->
            <div class="team-name">{{ homeName }}(主)</div>
          </div>
          <div>{{ startTime }}</div>
          <div class="team">
            <!-- <img src="./assets/default.png" alt="" /> -->
            <div class="team-name">{{ awayName }}(客)</div>
          </div>
        </div>
      </section>

      <section class="s2">
        <div class="left-ranking">
          <div>積分榜</div>
          <div class="bar-container">
            <div v-for="num in ranks.participant1.total_rank" :key="num" class="bar" :class="{ special: num === ranks.participant1.record_rank }">
              <span>{{ num }}</span>
            </div>
          </div>
        </div>
        <div class="left-progress d-flex flex-column align-center">
          <v-progress-circular class="mb-6" :rotate="360" :size="100" :width="10" :model-value="matchVictory.participant1.win_rate" color="#5c9af8">
            <div>{{ matchVictory.participant1.win_rate }}</div>
            <div class="left-progress_bar"></div>
            <div>狀態走勢</div>
          </v-progress-circular>
          <div>表現</div>
          <div class="left-progress_performance d-flex">
            <div v-for="(item, key) in matchVictory.participant1.history_matches" :key="key" class="box ml-1" :class="{ win: item === 1, lose: item === 0, duce: item === 2 }">
              {{ winLoseConfig[item] }}
            </div>
          </div>
        </div>
        <div class="left-team-info mx-5">
          <div class="left-team-info_win">{{ historyWin.participant1.history_win }}勝</div>
          <div class="left-team-content">
            <div class="left-text">
              <div>最高獲勝</div>
              <div>{{ maxWin.participant1.max_record_points }}</div>
            </div>
            <div class="left-text">
              <div>總得分</div>
              <div>{{ totalAvg.participant1.total_points }}</div>
            </div>
            <div class="left-text">
              <div>平均得分</div>
              <div>{{ totalAvg.participant1.avg_points }}</div>
            </div>
          </div>
        </div>
        <v-progress-circular class="mid-circle" :rotate="360" :size="100" :width="10" :model-value="formatHistoryWin()" color="#ff7a68">
          <div>{{ historyWin.total_history_record }}已賽</div>
        </v-progress-circular>
        <div class="right-team-info mx-5">
          <div class="right-team-info_win">{{ historyWin.participant2.history_win }}勝</div>
          <div class="right-team-content">
            <div class="right-text">
              <div>最高獲勝</div>
              <div>{{ maxWin.participant2.max_record_points }}</div>
            </div>
            <div class="right-text">
              <div>總得分</div>
              <div>{{ totalAvg.participant2.total_points }}</div>
            </div>
            <div class="right-text">
              <div>平均得分</div>
              <div>{{ totalAvg.participant2.avg_points }}</div>
            </div>
          </div>
        </div>
        <div class="right-progress d-flex flex-column align-center">
          <v-progress-circular class="mb-6" :rotate="360" :size="100" :width="10" :model-value="matchVictory.participant2.win_rate" color="#ff7a68">
            <div>{{ matchVictory.participant2.win_rate }}</div>
            <div class="right-progress_bar"></div>
            <div>狀態走勢</div>
          </v-progress-circular>
          <div>表現</div>
          <div class="right-progress_performance d-flex">
            <div v-for="(item, key) in matchVictory.participant2.history_matches" :key="key" class="box ml-1" :class="{ win: item === 1, lose: item === 0, duce: item === 2 }">
              {{ winLoseConfig[item] }}
            </div>
          </div>
        </div>
        <div class="right-ranking">
          <div>積分榜</div>
          <div class="bar-container">
            <div v-for="num in ranks.participant2.total_rank" :key="num" class="bar" :class="{ special: num === ranks.participant2.record_rank }">
              <span>{{ num }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 手機版 -->
      <section v-if="$vuetify.display.width < 1024" class="s2-mobile">
        <div class="s2-mobile-up-content d-flex justify-space-between">
          <v-progress-circular class="left-progress" :rotate="360" :size="80" :width="10" :model-value="matchVictory.participant1.win_rate" color="#5c9af8">
            <div>{{ matchVictory.participant1.win_rate }}</div>
            <div class="left-progress_bar"></div>
            <div>狀態走勢</div>
          </v-progress-circular>
          <div class="left-team-info_win">{{ historyWin.participant1.history_win }}勝</div>
          <v-progress-circular class="mid-circle" :rotate="360" :size="80" :width="10" :model-value="formatHistoryWin()" color="#ff7a68">
            <div>{{ historyWin.total_history_record }}已賽</div>
          </v-progress-circular>
          <div class="right-team-info_win">{{ historyWin.participant2.history_win }}勝</div>
          <v-progress-circular class="right-progress" :rotate="360" :size="80" :width="10" :model-value="matchVictory.participant2.win_rate" color="#ff7a68">
            <div>{{ matchVictory.participant2.win_rate }}</div>
            <div class="right-progress_bar"></div>
            <div>狀態走勢</div>
          </v-progress-circular>
        </div>
        <div class="s2-mobile-down-content d-flex justify-space-between">
          <div class="left-ranking">
            <div>積分榜</div>
            <div class="bar-container">
              <div v-for="num in ranks.participant1.total_rank" :key="num" class="bar" :class="{ special: num === ranks.participant1.record_rank }">
                <span>{{ num }}</span>
              </div>
            </div>
          </div>
          <div class="left-team-content">
            <div class="left-text">
              <div>最高獲勝</div>
              <div>{{ maxWin.participant1.max_record_points }}</div>
            </div>
            <div class="left-text">
              <div>總得分</div>
              <div>{{ totalAvg.participant1.total_points }}</div>
            </div>
            <div class="left-text">
              <div>平均得分</div>
              <div>{{ totalAvg.participant1.avg_points }}</div>
            </div>
          </div>
          <div class="right-team-content">
            <div class="right-text">
              <div>最高獲勝</div>
              <div>{{ maxWin.participant2.max_record_points }}</div>
            </div>
            <div class="right-text">
              <div>總得分</div>
              <div>{{ totalAvg.participant2.total_points }}</div>
            </div>
            <div class="right-text">
              <div>平均得分</div>
              <div>{{ totalAvg.participant2.avg_points }}</div>
            </div>
          </div>
          <div class="right-ranking">
            <div>積分榜</div>
            <div class="bar-container">
              <div v-for="num in ranks.participant2.total_rank" :key="num" class="bar" :class="{ special: num === ranks.participant2.record_rank }">
                <span>{{ num }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="s3">
        <div class="s3-history title">歷史對戰</div>
        <div class="s3-race title">
          <div class="match-time d-flex justify-center align-center">日期</div>
          <div class="match-middle">比賽</div>
          <div class="match-event d-flex justify-center align-center">賽事</div>
        </div>
        <div class="s3-events-contain" :class="{ expansion: isExpand, less: matchHistory.match_record.length < 6 }" ref="historyConatiner">
          <div v-for="item in matchHistory.match_record" :key="item.start_date" class="s3-events">
            <div class="match-time d-flex justify-center align-center">{{ item.start_date }}</div>
            <div class="match-middle">
              <div
                class="match-middle-team left"
                :class="{
                  win: item.participant1_value > item.participant2_value,
                }"
              >
                <span>{{ item.participant1_name }}</span>
                <!-- <img src="./assets/default.png" alt="" /> -->
              </div>
              <div class="match-middle-score">
                <span
                  :class="{
                    win: item.participant1_value > item.participant2_value,
                  }"
                  >{{ item.participant1_value }}</span
                >
                <span>:</span>
                <span
                  :class="{
                    win: item.participant2_value > item.participant1_value,
                  }"
                  >{{ item.participant2_value }}</span
                >
                <span>({{ formatStatusName(item.status_name) }})</span>
                <!-- {{ item.participant1_value }} : {{ item.participant2_value }}({{
                  formatStatusName(item.status_name)
                }}) -->
              </div>
              <div
                class="match-middle-team right"
                :class="{
                  win: item.participant2_value > item.participant1_value,
                }"
              >
                <!-- <img src="./assets/default.png" alt="" /> -->
                <span>{{ item.participant2_name }}</span>
              </div>
            </div>
            <div class="match-event d-flex justify-center align-center">{{ item.competition_name }}</div>
          </div>
        </div>
        <div class="btn-more d-flex justify-center">
          <v-btn v-if="matchHistory.match_record.length > 6" class="my-2 more" variant="elevated" color="primary" @click="isExpand = !isExpand">{{ isExpand ? "顯示更少" : "顯示更多" }}</v-btn>
        </div>
        <div class="s3-all-scores my-5">總比分</div>
        <div class="s3-vol-container mb-7">
          <div class="progress">
            <div class="progress-left-bar" :style="{ width: matchHistory.participant1.win_rate }" />
            <div v-if="matchHistory.draw.num" class="progress-mid-bar" :style="{ width: matchHistory.draw.rate }" />
            <div
              v-if="matchHistory.participant1.win_num"
              class="progress-left-text"
              :style="{
                left: calcText('left'),
              }"
            >
              主{{ matchHistory.participant1.win_rate }}({{ matchHistory.participant1.win_num }})
            </div>
            <div v-if="matchHistory.draw.num" class="progress-mid-text" :style="{ left: calcText('draw') }">和局{{ matchHistory.draw.rate }}({{ matchHistory.draw.num }})</div>
            <div
              v-if="matchHistory.participant2.win_num"
              class="progress-right-text"
              :style="{
                left: calcText('right'),
              }"
            >
              客{{ matchHistory.participant2.win_rate }}({{ matchHistory.participant2.win_num }})
            </div>
          </div>
        </div>
      </section>

      <S4Mobile v-if="$vuetify.display.width < 1024" :teamName="participantName" :matchData="matchTeamHis" :isRecent="true" />

      <S4Desktop v-else :matchData="matchTeamHis" :isRecent="true" />

      <S4Mobile v-if="$vuetify.display.width < 1024" :teamName="participantName" :matchData="matchFuture" />

      <S4Desktop v-else :matchData="matchFuture" />
      <S5Desktop />
    </main>
  </div>
  <div :style="{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }" v-else>
    <h1>暫無資料</h1>
  </div>
  <!-- <main>
    <TheWelcome />
  </main> -->
</template>

<style lang="scss" scoped>
@mixin s2-content-item($type) {
  .#{$type}-ranking {
    @if $type ==left {
      margin-right: auto;
    } @else {
      margin-left: auto;
      padding-right: 20px;
    }
  }

  .#{$type}-progress {
    :deep(.v-progress-circular__underlay) {
      stroke-width: 1 !important;
    }

    &_bar {
      width: 80%;
      height: 3px;
      background-color: $right-color;

      @if $type ==left {
        background-color: $left-color;
      } @else {
        background-color: $right-color;
      }
    }

    &_performance {
      // margin-top: 20px;

      .box {
        padding: 4px;
        line-height: 1;
        color: #fff;
      }

      .win {
        background: $secondary;
      }

      .lose {
        border: 1px solid $secondary;
        color: $secondary;
      }

      .duce {
        color: $secondary;
        background-color: #ddebff;
      }
    }
  }

  .#{$type}-team-info {
    &_win {
      width: 100px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 800;

      @if $type ==left {
        background-color: $left-color;
      } @else {
        background-color: $right-color;
      }
    }
  }

  .#{$type}-team-content,
  .#{$type}-text {
    display: flex;
    flex-direction: column;

    @if $type ==left {
      align-items: flex-end;
    } @else {
      align-items: flex-start;
    }
  }
}

.contain {
  width: calc(100vw - 16px);
  // height: 100vh;
  background-color: #f4f4f4;
}

.title,
header {
  color: #fff;
}

header {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  background-color: $secondary;
}

main {
  padding: 10px;
}

section {
  width: 100%;
}

.s1 {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);

  &-league {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    color: #fff;
    background: $primary;
  }

  &-teams {
    height: 100px;
    padding: 0 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $secondary;

    .team {
      display: flex;
      align-items: center;
      width: calc(50% - 40px);
      img {
        width: 40px;
        margin-right: 5px;
      }

      &-name {
        font-weight: 800;
      }
      &:last-child {
        flex-direction: row-reverse;
      }
    }
  }
}

// ranking條
.bar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80px;
}

.bar {
  position: relative;
  width: 80%;
  height: 3px;
  background-color: #ccc;
  margin: 2px 0;

  span {
    opacity: 0;
  }
}

.bar.special {
  width: 100%;
  background-color: $left-color;
  color: white;
  text-align: center;
  line-height: 10px;

  /* Align text vertically */
  span {
    opacity: 1;
    color: $text-color;
    position: absolute;
    right: -25px;
    top: -3px;
  }
}

.right-ranking {
  > div:first-child {
    text-align: end;
  }
  .bar-container {
    align-items: flex-end;
  }

  .bar.special {
    background-color: $right-color;
    span {
      left: -130px;
    }
  }
}

.s2,
.s3 {
  margin-top: 20px;
  &-history {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    color: #fff;
    background: $primary;
  }
}

.s2 {
  display: flex;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;

  @include s2-content-item(left);
  @include s2-content-item(right);

  :deep(.v-progress-circular__content) {
    color: $text-color;
    font-weight: 800;
    flex-direction: column;
  }

  .mid-circle {
    :deep(.v-progress-circular__underlay) {
      color: #5c9af8;
    }
  }
}

.s3 {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding-bottom: 30px;

  .s3-events-contain {
    height: 225px;
    overflow-y: hidden;
    border-bottom: 2px solid #f4f4f4;
    &.expansion {
      height: 400px;
      overflow-y: scroll;
    }
    &.less {
      height: inherit;
      // border-bottom: none;
    }
  }
  // .s3-events:nth-last-of-type(3) {
  //   // background-color: #f4f4f4;
  //   border-bottom: 2px solid #f4f4f4;
  //   }

  .match-time,
  .match-middle,
  .match-event {
    text-align: center;
  }

  .match-time,
  .match-event {
    width: 22vw;
  }

  .match-middle {
    width: 50vw;
  }

  &-race {
    height: 36px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-weight: 800;
    color: #fff;
    background: $secondary;
  }

  &-events {
    display: flex;
    justify-content: space-around;
    line-height: 2.5;

    .match-middle {
      display: flex;
      justify-content: center;

      &-team {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 33%;
        padding-left: 8px;
        line-height: 1.6;
        &.left {
          text-align: right;
        }
      }

      &-score {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 33%;
        padding-left: 8px;
        align-items: center;
        line-height: 1.6;
        width: 250px;
        // margin: 0 50px;
      }

      img {
        width: 20px;
      }
    }

    .win {
      color: $primary;
      font-weight: 700;
      span {
        font-weight: 500;
      }
    }

    &:nth-child(even) {
      background-color: #f4f4f4;
    }
  }

  &-all-scores {
    margin-top: 20px;
    font-weight: 800;
    text-align: center;
  }

  &-vol-container {
    position: relative;
    width: 70%;
    height: 30px;
    margin: 0 auto;

    .progress {
      // position: relative;
      height: 100%;
      background-color: $right-color;
      /*   border: 1px solid #ccc; */
      // margin: 20px 0;
      box-shadow: 0px 0px 3px 0px rgba(#0cf0e2, 0.3);

      &-left-text {
        position: absolute;
        color: #fff;
        left: calc(50% - 16px);
      }

      &-mid-text {
        z-index: 4;
        position: absolute;
        color: #fff;
        // left: calc(45% - 16px);
        left: 0%;
      }

      &-right-text {
        position: absolute;
        color: #fff;
        left: 90%;
      }

      &-left-bar {
        position: absolute;
        width: 10%; // 這個會依據給進來的量
        height: 100%;
        background-color: $left-color;
      }

      &-mid-bar {
        position: absolute;
        height: 100%;
        // z-index: 2;
        width: 30%;
        left: 0%;
        background-color: grey;
      }
    }
  }
}

@media (max-width: 1024px) {
  .contain {
    width: calc(100vw - 6px);
    height: auto;
  }

  .s1-teams {
    padding: 0 10px;
    flex-wrap: wrap;
    height: unset;
    > div {
      order: 1;
      flex: 1 1 100%;
      text-align: center;
    }
    .team {
      flex-direction: column;
      justify-content: center;
      flex: 1 1 50%;
      order: -1;
      img {
        margin: 0;
      }
    }
  }
  .right-ranking {
    .bar.special {
      span {
        left: -80px;
      }
    }
  }

  .s2 {
    display: none;
  }

  .s2-mobile {
    margin-top: 20px;
    padding: 20px 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
    font-size: 14px;

    :deep(.v-progress-circular__content) {
      color: $text-color;
      font-size: 12px;
      flex-direction: column;
    }

    :deep(.v-progress-circular__underlay) {
      stroke-width: 3;
    }
    .mid-circle {
      :deep(.v-progress-circular__underlay) {
        color: #5c9af8;
      }
    }

    .left-progress,
    .right-progress {
      :deep(.v-progress-circular__underlay) {
        stroke-width: 1;
      }

      &_bar {
        width: 80%;
        height: 2px;
      }
    }

    .left-progress_bar {
      background-color: $left-color;
    }
    .right-progress_bar {
      background-color: $right-color;
    }

    :deep(.v-progress-circular__overlay) {
      stroke-width: 3;
    }

    .left-team-info_win,
    .right-team-info_win {
      width: 50px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 800;
    }

    .left-team-info_win {
      background-color: $left-color;
    }

    .right-team-info_win {
      background-color: $right-color;
    }

    .bar-container {
      width: 30px;
    }

    .left-text,
    .right-text {
      display: flex;
      flex-direction: column;
    }

    .left-text {
      align-items: flex-end;
    }

    .right-text {
      align-items: flex-start;
    }
  }

  .s3 {
    .s3-events {
      height: 110px;
      line-height: unset;
    }
    .s3-events-contain {
      font-size: 12px;
      height: 660px;
      &.expansion {
        height: 900px;
      }
    }
    .match-time {
      max-width: 90px;
    }
    .match-event {
      width: calc(33vw - 90px);
    }

    .match-middle {
      width: calc(66vw - 90px);
      flex-direction: column;
      align-items: center;
      > * {
        max-width: 100%;
        width: unset;
      }
      .match-middle-team {
        &.left {
          justify-content: center;
        }
        &.right {
          justify-content: center;
        }
      }
    }
  }
}
</style>
