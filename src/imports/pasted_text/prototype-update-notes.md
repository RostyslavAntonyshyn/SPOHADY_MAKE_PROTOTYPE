Please update the current prototype with the following changes. Keep the existing overall visual style and navigation unless explicitly mentioned below.

1. Login screen

* Remove the "Continue with Apple" option.
* Keep Google and Email login options.

2. Placeholder photos

* Many placeholder/template photos are currently not rendering correctly.
* Replace all broken or missing images with working realistic photo placeholders.
* Keep photo content consistent across the prototype.

3. Home screen / Create button

* The current "+ Create" button is too prominent and intrusive.
* Make "Suggested" the main focus of the Home screen.
* Keep the suggested album grid immediately visible.
* Move "+ Create" into a smaller floating button in the bottom-right corner.
* It should remain easy to find, but visually secondary to suggested albums.

4. Suggested album details

* After opening a suggested album, keep:

  * hero image
  * album title
  * basic album information
* Remove the small overlapping photo thumbnails near the title/description.
* They currently interfere with the text and are unnecessary because the full photo preview/review exists on a separate screen.

5. Book size selection — remove "Most Popular"

* Remove the "Most Popular" badge or recommendation.
* Small, Medium and Large should have equal visual importance.

6. Book size selection — currency

* Change all pricing to Ukrainian hryvnia.
* Use the "₴" currency symbol.
* Do not use EUR or USD anywhere in the purchasing flow.

7. Book size selection — static pricing

* Remove the word "From".
* Prices are fixed and should be displayed as exact prices.

Example:

Small
20 × 20 cm
₴899

Medium
25 × 25 cm
₴1,299

Large
30 × 30 cm
₴1,799

8. Book size selection — preview

* Each size card should contain a preview of the actual generated album cover.
* Do not use generic size illustrations.
* The same album should be shown in Small, Medium and Large format so the user clearly understands they are choosing the physical size of the same book.

9. Three design variations

* On the screen where the user chooses between three generated book variations, show three complete album cover designs.
* Do not show random collections of photos.
* Each option should visually look like a finished photo book.
* The user should immediately understand that they are choosing between three different complete design directions.

10. Book editor — navigation between pages

* Replace manual page selection with natural continuous scrolling through the album.
* The user should be able to smoothly scroll through all book pages/spreads.
* The experience should feel like browsing through a document or photo book rather than selecting individual page numbers.
* Keep editing actions contextual to the currently visible page.

11. Page Layout popup

* Make layout options visually clear and immediately understandable.
* Each layout option should be represented by a realistic miniature page layout.

Examples:

* single full-page photo
* two equal photos
* one large + two small
* three-photo grid
* four-photo grid
* edge-to-edge layout
* editorial layout with white margins

Do not represent layouts using vague abstract icons.

12. Remove Auto Layout from the editor

* Remove the "Auto Layout" action from the manual editor.
* The user already starts with a fully automatically generated photo book.
* The purpose of the editor is only to manually fine-tune the generated result.
* Keep actions such as:

  * replace photo
  * crop
  * change layout
  * reorder
  * add text

13. Text editor

* Remove the "Small Note" option.
* Keep only:

  * Title
  * Caption

14. Book Preview

* Redesign Preview so the user sees the finished physical photo book.
* Do not show isolated photos or plain page layouts.
* Show the photos inside realistic finished book pages, including:

  * page background
  * margins
  * layout
  * typography
  * cover
  * overall book styling
* The user should still be able to swipe/scroll through the book, but it should visually feel like browsing the final printed product.

15. Checkout preview

* At the top of Checkout, show the finished album cover instead of a standalone photo.
* Use the exact cover selected/generated earlier.
* Keep this cover consistent through Product Summary, Checkout and Order Confirmation.

16. Remove size selection from checkout

* Once the user reaches payment/checkout, the album size must no longer be editable.
* The size was already selected before the book was generated.
* The layouts and pages have already been designed specifically for that format.
* Checkout should only summarize the selected size.

If the user wants another size, they should go back to the earlier book configuration flow instead of changing it during payment.

17. Ukrainian shipping flow

* Redesign the shipping/address flow specifically for Ukraine.

First ask the user to choose the delivery provider:

Nova Poshta
Ukrposhta

For Nova Poshta support:

* First name
* Last name
* Phone number
* City / settlement
* Delivery type:

  * Branch
  * Parcel locker
* Branch or parcel locker number/search

For Ukrposhta support:

* First name
* Last name
* Phone number
* City / settlement
* Postal code
* Branch or delivery address

Use Ukrainian location examples throughout the prototype.

Example:
Lviv
Kyiv
Ivano-Frankivsk

Do not use US-style State / ZIP / international checkout fields.

The shipping experience should feel like a typical Ukrainian e-commerce checkout.

18. Remove Express Delivery screen

* Remove the separate delivery speed selection screen completely.
* Do not ask the user to choose between Standard and Express delivery.
* Delivery terms can be shown later as informational text based on the selected carrier.
* After the shipping details screen, continue directly to payment.

General requirement:
Preserve the existing prototype structure and styling wherever possible.
Do not redesign unrelated screens.
Apply these changes consistently across all relevant screens and interactions.
