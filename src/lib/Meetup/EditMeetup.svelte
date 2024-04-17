<script>
    import meetups from "../../store/meetups-store.js";
    import { createEventDispatcher } from "svelte";
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import Modal from "../UI/Modal.svelte";
    import { isEmpty, isValidEmail } from "../../helpers/validation.js";
    import { detach } from "svelte/internal";

    export let id = null;

    let title = "";
    let subtitle = "";
    let address = "";
    let imageUrl = "";
    let email = "";
    let description = "";

    if (id) {
        const unsubscribe = meetups.subscribe((items) => {
            const selectedMeetup = items.find((i) => i.id === id);
            title = selectedMeetup.title;
            subtitle = selectedMeetup.subtitle;
            address = selectedMeetup.address;
            email = selectedMeetup.contactEmail;
            imageUrl = selectedMeetup.imageUrl;
            description = selectedMeetup.description;
        });

        unsubscribe();
    }

    const dispatch = createEventDispatcher();

    $: titleValid = !isEmpty(title);
    $: subtitleValid = !isEmpty(subtitle);
    $: addressValid = !isEmpty(address);
    $: descriptionValid = !isEmpty(description);
    $: imageUrlValid = !isEmpty(imageUrl);
    $: emailValid = isValidEmail(email);
    $: formIsValid =
        titleValid &&
        subtitleValid &&
        addressValid &&
        descriptionValid &&
        imageUrlValid &&
        emailValid;

    function submitForm() {
        const meetupData = {
            title: title,
            subtitle: subtitle,
            description: description,
            imageUrl: imageUrl,
            address: address,
            contactEmail: email,
        };

        if (id) {
            fetch(
                `https://udemy-svelte-course-90fe5-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`,
                {
                    method: "PATCH",
                    body: JSON.stringify(meetupData),
                    headers: { "Content-Type": "application/json" },
                },
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("An error occured, try again.");
                    }
                    meetups.updateMeetup(id, meetupData);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            fetch(
                "https://udemy-svelte-course-90fe5-default-rtdb.europe-west1.firebasedatabase.app/meetups.json",
                {
                    method: "POST",
                    body: JSON.stringify({ ...meetupData, isFavorite: false }),
                    headers: { "Content-Type": "application/json" },
                },
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("An error occured, try again.");
                    }
                    return res.json();
                })
                .then((data) => {
                    meetups.addMeetup({
                        ...meetupData,
                        isFavorite: false,
                        id: data.name,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        dispatch("save");
    }

    function deleteMeetup() {
        fetch(
            `https://udemy-svelte-course-90fe5-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`,
            {
                method: "DELETE",
            },
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("An error occured, try again.");
                }
                meetups.removeMeetup(id);
            })
            .catch((err) => {
                console.log(err);
            });
        dispatch("cancel");
    }

    function cancel() {
        dispatch("cancel");
    }
</script>

<Modal title="Edit Meetup Data" on:cancel>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
            id="title"
            label="Title"
            valid={titleValid}
            validityMessage="Please enter a valid title."
            value={title}
            on:input={(event) => (title = event.target.value)}
        />
        <TextInput
            id="subtitle"
            label="Subtitle"
            valid={subtitleValid}
            validityMessage="Please enter a valid subtitle."
            value={subtitle}
            on:input={(event) => (subtitle = event.target.value)}
        />
        <TextInput
            id="address"
            label="Address"
            valid={addressValid}
            validityMessage="Please enter a valid address."
            value={address}
            on:input={(event) => (address = event.target.value)}
        />
        <TextInput
            id="imageUrl"
            label="Image URL"
            valid={imageUrlValid}
            validityMessage="Please enter a valid image URL."
            value={imageUrl}
            on:input={(event) => (imageUrl = event.target.value)}
        />
        <TextInput
            id="email"
            label="Email"
            valid={emailValid}
            validityMessage="Please enter a valid email address."
            type="email"
            value={email}
            on:input={(event) => (email = event.target.value)}
        />
        <TextInput
            controlType="textarea"
            rows="3"
            id="description"
            label="Description"
            valid={descriptionValid}
            validityMessage="Please enter a valid description."
            value={description}
            on:input={(event) => (description = event.target.value)}
        />
    </form>
    <div slot="footer">
        <Button type="submit" mode="outline" on:click={cancel}>Cancel</Button>
        <Button type="submit" on:click={submitForm} disabled={!formIsValid}
            >Save</Button
        >
        {#if id}
            <Button type="button" on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>

<style>
    form {
        width: 100%;
    }
</style>
