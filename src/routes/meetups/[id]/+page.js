/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const meetupId = params.id;

    return fetch(
        `https://udemy-svelte-course-90fe5-default-rtdb.europe-west1.firebasedatabase.app/meetups/${meetupId}.json`,
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error(
                    "Fetching meetups failed, please try again.",
                );
            }
            return res.json();
        })
        .then((meetupData) => {
            return { loadedMeetup: {...meetupData, id: meetupId } }
        })
        .catch((err) => {
            error = err;
            isLoading = false;
            console.log(err);
            this.error(404, "Could not fetch meetups");
        });
}