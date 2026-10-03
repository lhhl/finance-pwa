# Framework7 Utility Classes

Reference for Framework7 v9.2.0, taken from the installed `node_modules/framework7` package. Most classes are defined in `components/typography/typography.less`. Every rule except the color-modifier and theme/safe-area helpers is set with `!important`.

## Display and flexbox

| Group           | Classes                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display         | `display-flex`, `display-block`, `display-inline-flex`, `display-inline-block`, `display-inline`, `display-none`                                          |
| Flex direction  | `flex-direction-row`, `flex-direction-row-reverse`, `flex-direction-column`, `flex-direction-column-reverse`                                              |
| Flex shrink     | `flex-shrink-0` … `flex-shrink-10`                                                                                                                        |
| Justify content | `justify-content-flex-start`, `-center`, `-flex-end`, `-space-between`, `-space-around`, `-space-evenly`, `-stretch`, `-start`, `-end`, `-left`, `-right` |
| Align content   | `align-content-flex-start`, `-flex-end`, `-center`, `-space-between`, `-space-around`, `-stretch`                                                         |
| Align items     | `align-items-baseline`, `-flex-start`, `-flex-end`, `-center`, `-stretch`                                                                                 |
| Align self      | `align-self-flex-start`, `-flex-end`, `-center`, `-stretch`                                                                                               |

## Text and layout

| Group          | Classes                                            |
| -------------- | -------------------------------------------------- |
| Text align     | `text-align-left`, `-center`, `-right`, `-justify` |
| Vertical align | `vertical-align-top`, `-middle`, `-bottom`         |
| Float          | `float-left`, `float-right`, `float-none`          |
| Width          | `width-auto`, `width-100`                          |

## Spacing

The default spacing is 16px, set by `--f7-typography-padding` and `--f7-typography-margin`.

| Group          | Classes                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Add padding    | `padding`, `padding-top`, `-bottom`, `-left`, `-right`, `-vertical`, `-horizontal`. Each also has a `-half` version, e.g. `padding-top-half` |
| Add margin     | `margin`, `margin-top`, `-bottom`, `-left`, `-right`, `-vertical`, `-horizontal`. Each also has a `-half` version                            |
| Remove padding | `no-padding`, `no-padding-top`, `-bottom`, `-left`, `-right`, `-vertical`, `-horizontal`                                                     |
| Remove margin  | `no-margin`, `no-margin-top`, `-bottom`, `-left`, `-right`, `-vertical`, `-horizontal`                                                       |

## Colors

- **Patterns:** `text-color-{name}`, `bg-color-{name}`, `border-color-{name}`, and `color-{name}` (sets the component's theme color).
- **Names:** `primary`, `red`, `green`, `blue`, `pink`, `yellow`, `orange`, `purple`, `deeppurple`, `lightblue`, `teal`, `lime`, `deeporange`, `white`, `black`.
- **React props:** these produce the same classes, e.g. `textColor="black"`, `bgColor`, `borderColor`, `color`.

## Grid

- `grid`, plus `grid-gap` to add spacing between cells.
- `grid-cols-{1–20}` and `grid-rows-{1–20}`.
- Responsive versions add a size prefix, e.g. `medium-grid-cols-3`:

| Prefix    | Min width |
| --------- | --------- |
| `xsmall-` | 480px     |
| `small-`  | 568px     |
| `medium-` | 768px     |
| `large-`  | 1024px    |

## Theme and safe area

- **iOS/Material theme:** `ios-only`, `md-only`, `if-ios`, `if-md`, `if-not-ios`, `if-not-md`
- **Safe area:** `safe-areas`, `safe-area-left`, `safe-area-right`, `no-safe-areas`, `no-safe-area-left`, `no-safe-area-right`

## Not provided

There are no height, gap (outside `grid-gap`), font-size or font-weight utilities. Use inline styles or custom CSS for those.
