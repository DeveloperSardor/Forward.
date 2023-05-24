<template>
    <div class="result text-light">
        <div class="top font-monospace border-bottom">
            <p class="fs-5"><i class="fas fa-filter"></i> Filter &nang;
                Result for {{ searchQuery }}
            </p>
        </div>
        <p v-if="!resultData.length" class="not_found p-4 text-center fs-3  fw-bold">Not Found {{ searchQuery }}</p>
        <div class="result_content-wrapper mt-4 d-flex align-items-center justify-content-around flex-wrap">
            <ContentList :contents="resultData" />
        </div>
    </div>
</template>
<script >
import axios from "axios";
import { backendUrl } from "../../env";
import { ref, onMounted } from "vue";
import ContentList from "../components/content/ContentList.vue";

export default {
    name: "SearchResult",
    
    data() {
        return {
            searchQuery: this.$route.query?.search,
            resultData: [],
            url: backendUrl,
            config: {
                headers: { token: JSON.parse(localStorage.getItem("userInfo"))?.token },
            },
        };
    },
    created() {
        this.getDatas(this.searchQuery)
    },
    methods: {
        async getDatas(query) {
            if (query) {
                try {
                    let { data } = await axios.get(
                        `${this.url}/contents?search=${query}`,
                        this.config
                    );
                    if (data.success) {
                        this.resultData = data.data;
                    } else {
                        console.log(`Error occured`);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        },
    },

    components: { ContentList },
};
</script>
<style>
.result {
    padding: 1rem;
    margin-top: 4.5rem;
}
</style>
