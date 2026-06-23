const { animate, inView, scroll } = Motion;

inView(".Catchphrase-box", () => {
    animate(".Catchphrase-box",
        { opacity: [0, 1], y: [50, 0] },
        { duration: 0.8, easing: "ease-out" }
    );
});