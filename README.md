# Collab board

Create a powerful sticker board

[Online Server](http://board.zhuoyou.cafe)

Any suggestions please leave an issue.

### Build from strach

**Note:** You need *nix operating system, with bash, git, docker installed.

*clone the code*

```bash
git clone git@github.com:carwestsam/collab_board.git
cd collab_board
```

*[Carwest ONLY], create generic node js image. Need docker service stated*

```bash
./auto/gen-nodejs-build   # create generic nodejs version 8 image, based on ubuntu 16.04
./auto/gen-nodejs-push    # push the image build above
```

*create a dev environment*

```bash
./auto/dev-nodejs-build   # create nodejs version 8 image for developer local development
./auto/dev-web-build
./auto/dev-start
# open you browser with url: http://localhost:8080
```

**Hint:** If you could faceing port conflict, please change config in ```./config/dev/vars.sh```

### Handy tool links

- [sequelize-cli README](https://github.com/sequelize/cli/blob/master/docs/README.md)
- [sequelize queryInterface README](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)
- [KeyboardJS](https://github.com/RobertWHurst/KeyboardJS)
- [Materialize Icons](https://material.io/icons/)
- [Vuetify](https://vuetifyjs.com/)

### This project is inspired by 
- [Sprint Retrospective](https://www.scrum.org/resources/what-is-a-sprint-retrospective)
- [Google Wave](https://sites.google.com/a/pressatgoogle.com/googlewave/)
