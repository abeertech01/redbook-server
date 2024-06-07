# Redbook Server

This repository contains the backend for the Redbook social media application, built with Node.js and TypeScript. The server provides the necessary APIs and real-time communication support for the frontend application.

## Table of Contents

- [About the project](#about-the-project)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)

## About the Project

Redbook Server is the backend component of the Redbook social media application, inspired by platforms like Facebook and Reddit. It handles user authentication, post creation, commenting, real-time chat, and more. This project is under active development, and new features are being added regularly.

### Technologies Used

The Redbook Server backend is built using the following technologies:

- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **PostgreSQL**: Open source relational database management system.
- **Prisma**: Modern database access toolkit for Node.js & TypeScript.
- **Socket.IO**: Library for real-time web applications.
- **JSON Web Token (JWT)**: Compact and self-contained way for securely transmitting information between parties.

## Features

- User authentication and authorization
- Create, read, update, and delete posts
- Comment on posts with nested replies up to 20 levels deep
- User profile management
- Real-time chat functionality
- Scalable and maintainable codebase with TypeScript

## Getting Started

To get a local copy of the backend server up and running, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version 18 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (Node Package Manager): This typically comes with Node.js, but you can check if it’s installed by running `npm -v` in your terminal.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/abeertech01/redbook-server.git
   ```
