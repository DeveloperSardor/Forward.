<template >
    <div class="card bg-transparent p-3 pb-3 m-3">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "Card"
}
</script>
<style >
.card .avatar_img {
    width: 40px;
    border-radius: 20px;
}

.card {
    top: 0;
    line-height: 1.4rem;;
    margin-left: 5rem;
    /* border-color: rgba(250, 235, 215, 0.435) !important; */
    height: 360px;
    width: 300px;
    word-wrap: break-word;
    word-break: break-all;
    transition: .4s ease-out;
}

.card:hover {
    border: 0.6px solid #ffffff56 !important;
    box-shadow: rgba(100, 100, 111, 0.2) 10px 7px 29px 10px;
}

.card .content {
    width: 90%;
    height: 75%;
    border-radius: 14px;
}

.card video {
    left: 5%;
    width: 80%;
    height: 200px;
    /* width: 100px; */
}

.card .right.dropdown .dropdown-menu {
    background: #282828 !important;
    width: 245px;
}

.card .right.dropdown .dropdown-menu li {
    width: 90%;
    padding: 0.4rem;
    cursor: pointer;
    margin: 0.5rem;
    border-radius: 9px;
}

.card .right.dropdown .dropdown-menu li:hover {
    background: #535353 !important;
}

.card .option {
    cursor: pointer;
    transition: 0.5s ease-in-out;
    padding: 0.6rem;
}</style>