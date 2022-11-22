# tzdata-ingester

This is a simple script that ingests the wikipedia [list of timezones](https://wikipedia.org/wiki/List_of_tz_database_time_zones) and outputs a JSON file that can be used by [**js.component**](https://jscomponent.info), as well as an Excel file so you can view and search the data more easily than is possible on wikipedia.

## Installation

```shell
git clone https://github.com/aparajita/tzdata-ingester.git
cd tzdata-ingester
pnpm install # or npm install
```

## Usage

```shell
node index.mjs
```

This will update `tzdata.json` and `tzdata.xlsx`. To use `tzdata.json` in **js.component**:

- Copy it to the `Resources` folder of the component.
- Either reopen the host project, or;
- Run the following code in the host project:

```4d
DateTime.loadTzData()
```
