<script>
    /** @type {import('./$types').PageData} */
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import Button from "$lib/UI/Button.svelte";
    import MeetupItem from "$lib/Meetup/MeetupItem.svelte";
    import MeetupFilter from "$lib/Meetup/MeetupFilter.svelte";
    import { flip } from "svelte/animate";
    import { scale } from "svelte/transition";
    import LoadingSpinner from "$lib/UI/LoadingSpinner.svelte";
    import EditMeetup from "$lib/Meetup/EditMeetup.svelte";
    import meetups from "../store/meetups-store";

    export let data = {};
    let loadedMeetups = [];
    let storedMeetups = [];
    let editMode;
    let editedId;
    let isLoading = false;
    let unsubscribe;

    let favsOnly = false;

    onMount(() => {
        unsubscribe = meetups.subscribe(items => {
            storedMeetups = items;
        })
        if (data && data.loadedMeetups) {
            loadedMeetups = data.loadedMeetups.reverse(); // Extract the array from data and flip the order
            meetups.setMeetups(loadedMeetups); // Assuming 'meetups' is your store to manage meetups
        }
    });

    const dispatch = createEventDispatcher();

    $: filteredMeetups = favsOnly
        ? storedMeetups.filter((m) => m.isFavorite)
        : storedMeetups;

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    function setFilter(event) {
        favsOnly = event.detail === 1;
    }

    function savedMeetup(event) {
        editMode = null;
        editedId = null;
    }

    function cancelEdit() {
        editMode = null;
        editedId = null;
    }

    function startEdit(event) {
        editMode = "edit";
        editedId = event.detail;
    }

    function startAdd() {
        editMode = "edit";
    }
    console.log(loadedMeetups);
</script>

<svelte:head>
    <title>MeetUps App</title>
</svelte:head>

{#if editMode === "edit"}
    <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
    <LoadingSpinner />
{:else}
    <section id="meetup-controls">
        <MeetupFilter on:select={setFilter} />

        <Button on:click={startAdd}>New Meetup</Button>
    </section>
    {#if filteredMeetups.length === 0}
        <p id="no-meetups">No meetups found. Why don't you add one?</p>
    {/if}
    <section id="meetups">
        {#each filteredMeetups as meetup (meetup.id)}
            <div
                animate:flip={{ duration: 250 }}
                transition:scale={{ duration: 250 }}
            >
                <MeetupItem
                    id={meetup.id}
                    title={meetup.title}
                    subtitle={meetup.subtitle}
                    address={meetup.address}
                    description={meetup.description}
                    imageUrl={meetup.imageUrl}
                    email={meetup.email}
                    isFav={meetup.isFavorite}
                    on:edit={startEdit}
                />
            </div>
        {/each}
    </section>
{/if}

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    #no-meetups {
        margin: 1rem;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
