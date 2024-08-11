# The Wild Oasis

Based on a tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann

Built while learning more advanced React features (e.g. compound components, render props), and Supabase integration.

## Improvements

Improvements made to the project include:

-   Rewrote add/edit cabin features to improve separation of concerns and use react-hook-forms.
-   Added smart pagination:
    -   List pages now automatically display as many items as will fit on screen.
    -   Uses forwardRef to determine item height and area available, custom hook to rerender on window resize, and Context which calculates and provides appropriate resultsPerPage.
-   Improved responsive design for smaller screens.
-   Improved UI and business logic for payment confirmation.
-   Fixed context menu positioning (handle scrolling and positioning near edges of screen).
-   Updated to use transient props to prevent invalid parameters leaking onto the DOM.
-   Removed use of deprecated cloneElement function:
    -   Replaced with render props pattern and createElement function.
-   Added context-aware redirect after check in.
-   Corrected currency formatting in SalesChart:
    -   Implemented custom recharts tooltip and tick formatter.
-   Prevent automatically logging in as newly created user.
-   Upsert single user and cabin images.
    -   (To prevent retaining redundant images.)
-   Display first line of stack trace on ErrorFallback.
-   Added max limit to react-hot-toast.
-   Import secrets from environment variables.
-   Prefill default demo user, if defined in .env.

## Limitations

My goal was to fix some issues that nagged at me, and improve this project as much as I could without spending too much time on it - better to spend that time on my own projects!
Therefore, there are still some known issues:

-   No tests are included.
-   The app is not fully responsive or suitable for mobile.
    -   Things are greatly improved, but admittedly the improvements don't always adhere to the best practices (e.g. there are some magic numbers without a single source of truth). This was an exercise in pragmatism: how good can I get it without a massive refactor!

## Hosted Demo

The application is hosted at: https://the-wild-oasis-rho-ten.vercel.app/

For this demo, account creation and updating are disabled. The sample data uploader in the bottom left can be used to seed example data.

(Note that this is hosted on Vercel/Supabase free tiers, and may have been paused.)
