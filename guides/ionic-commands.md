**References:**

- https://capacitorjs.com/docs/basics/workflow#sync-your-project

**TL;DR:**

| Step         | Command Example                                                            |
| ------------ | -------------------------------------------------------------------------- |
| Create app   | `ionic start myApp blank`                                                  |
| Add platform | `ionic capacitor add android`                                              |
| List devices | `ionic capacitor run android --list`                                       |
| Run live     | `ionic capacitor run android --livereload --external --target=<device_id>` |
| Open IDE     | `ionic capacitor run android --open`                                        |

---

To **generate a new Ionic project** and **run it live on a physical device** (with the ability to choose the device), follow these steps:

### 1. Generate a New Ionic Project

```bash
ionic start myApp blank
```

- Replace `myApp` with your desired project name.
- You can choose other templates like `tabs` or `sidemenu` if preferred[10][12].

### 2. Add a Platform (Android/iOS)

```bash
# * Build the project
npm run build
```

```bash
ionic capacitor add android
# or
ionic capacitor add ios
```

- Run the command(s) relevant to your target device(s)[1][12].

### 3. List Available Devices

To see all connected devices and emulators:

```bash
ionic capacitor run android --list
# or
ionic capacitor run ios --list
```

- This will display all available targets by their IDs[1][9].

### 4. Run the App with Live Reload on a Physical Device

**For live reload on a specific device:**

```bash
ionic capacitor run android --livereload --external --target=
```

- Replace `` with the actual ID from the previous step[1][9].
- Use `--external` to ensure your device can access the dev server over the network (your computer and device must be on the same Wi-Fi)[1].
- For iOS, substitute `android` with `ios`.

**If you want to just run (without specifying a device):**

```bash
ionic capacitor run android --livereload --external
```

- This will deploy to the first available device or emulator[1][9].

### 5. Additional Notes

- **Live reload** means changes in your code will instantly reflect on the device, but you must keep the device and computer on the same network.
- If you have only one device connected, you can omit the `--target` option.
- If you want to open the native IDE (Android Studio or Xcode), use `--open` instead of running directly[1][9].
