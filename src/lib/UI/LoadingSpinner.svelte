<script>
    export let isInline = null;
</script>

{#if isInline}
    <div class="lds-facebook lds-facebook--inline">
        <div></div>
        <div></div>
        <div></div>
    </div>
{:else}
    <div class="loading">
        <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <p>Loading...</p>
    </div>
{/if}

<style>
    .loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 2rem;
    }

    .lds-facebook,
    .lds-facebook div {
        box-sizing: border-box;
    }
    .lds-facebook {
        display: block;

        position: relative;
        width: 5rem;
        height: 5rem;
    }
    .lds-facebook div {
        display: inline-block;
        position: absolute;
        left: 0.5em;
        width: 1em;
        background: currentColor;
        animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }
    .lds-facebook div:nth-child(1) {
        left: 0.5em;
        animation-delay: -0.24s;
    }
    .lds-facebook div:nth-child(2) {
        left: 2em;
        animation-delay: -0.12s;
    }
    .lds-facebook div:nth-child(3) {
        left: 3.5em;
        animation-delay: 0s;
    }

    .lds-facebook--inline {
        display: inline-block;
        font-size: 0.2rem;
        width: 1rem;
        height: 1rem;

    }
    @keyframes lds-facebook {
        0% {
            top: 0.5em;
            height: 4em;
        }
        50%,
        100% {
            top: 1.5em;
            height: 2em;
        }
    }
</style>
