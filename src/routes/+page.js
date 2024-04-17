/** @type {import('./$types').PageLoad} */
export async function load() {
    return fetch(
        "https://udemy-svelte-course-90fe5-default-rtdb.europe-west1.firebasedatabase.app/meetups.json",
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error(
                    "Fetching meetups failed, please try again.",
                );
            }
            return res.json();
        })
        .then((data) => {
            const loadedMeetups = [];
            for (const key in data) {
                loadedMeetups.push({
                    ...data[key],
                    id: key,
                });
            }
            return { loadedMeetups };
            // setTimeout(() => {
            //     isLoading = false;
            //     meetups.setMeetups(loadedMeetups.reverse());
            // }, 1000);
        })
        .catch((err) => {
            error = err;
            isLoading = false;
            console.log(err);
            this.error(500, "Could not fetch meetups");
        });
}