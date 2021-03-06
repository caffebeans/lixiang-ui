import Mock from "mockjs";
const LoginUsers = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
    name: "理想",
  },
];

const Users = [];

for (let i = 0; i < 10; i++) {
  Users.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock("@county(true)"),
      "age|18-60": 1,
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1),
    })
  );
}

export { LoginUsers, Users };
