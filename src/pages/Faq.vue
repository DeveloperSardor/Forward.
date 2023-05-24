<template>
    <div class="faq ">
        <div class="container px-5 ">
            <h3 class="faq_title fs-3">FAQ</h3>
            <p class="text-secondary font-monospace">most frequently asked questions.</p>
            <div class="accordion rounded" id="accordionFlushExample">
                <div class="accordion-item rounded border">
                    <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            What a company this is?
                        </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body ">Placeholder content for this accordion, which is intended to demonstrate
                            the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            What is the function of this app?
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                        data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate
                            the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine
                            this being filled with some actual content.</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingThree">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            How do I post a content?
                        </button>
                    </h2>
                    <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree"
                        data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate
                            the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more
                            exciting happening here in terms of content, but just filling up the space to make it look, at
                            least at first glance, a bit more representative of how this would look in a real-world
                            application.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "FAQ",
    created() {
        document.title = 'FAQ'
    }
}
</script>
<style scoped>
.faq {
    padding: 3rem;
    margin-top: 4rem;
    background: #1A202C !important;
    width: 100%;
    height: 100%;
}

.faq .container {
    /* background-image: url(../../public/bg-img/faq-img.webp); */
    min-height: 70vh;
    background-repeat: no-repeat;
    width: 100%;
    background-size: cover;
    object-position: center;
}

.faq_title {
    color: #38A169;
    font-family: 'Times New Roman', Times, serif;
    font-weight: 700;
}

.accordion-button {
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.accordion-item:hover{
    background: #2B3545 !important;
}
.accordion-item:hover .accordion-button{
    background: #2B3545 !important;
}
.accordion-body {
    background: #2D3748 !important;
    border-radius: 10px;
}
.accordion-item,
.accordion-button {
    background: #4A5568 !important;
    color: #fff !important;
    padding: 0.4rem;
    box-shadow: none !important;
    transition: .4s ease;
    margin: 0.3rem;
}</style>