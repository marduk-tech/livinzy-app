# Project Ultron

## Table of Contents

- [Setup & Installation](#setup)
- [Commit Guidelines](#commit-guidelines)
- [Design Guidelines](#design-guidelines)

## Setup

#### Install Dependencies

```bash
npm install
```

#### Running the Project Locally

```bash
npm run dev
```

#### Build for Production

```bash
npm run build
```

#### Additional Commands

##### Linting

```bash
npm run lint
```

##### Format Project

```bash
npm run format
```

## Commit Guidelines

- Checkout `dev` branch and make changes in the dev branch only.
- When ready with the changes, push changes to `dev` branch and create a pull request from dev to main for review.
- Changes will be merged with the main branch for review.

## Design Guidelines

> **_NOTE:_**
> Wherever possible, only use components directly. Refer to https://ant.design/components/overview for a list of all the components.

### Font styling

Only these three different types of elements whenever you want to display text.

#### Heading

`<Typography.Title level={4}>Heading</Typography.Title>`

#### Sub Heading

`<Typography.Title level={3}>Sub heading</Typography.Title>`

#### Primary Text

`<Typography.Text>Primary text</Typography.Text>`

#### Primary Text Secondary

`<Typography.Text type="secondary">Secondary text</Typography.Text>`

#### Paragraph Text

`<Typography.Text>Paragraph</Typography.Text>`

#### Colors

Primary theme colors have been configured into Ant. See `App.tsx`. Mostly, you wouldn't need to apply colors separately to any elements.
