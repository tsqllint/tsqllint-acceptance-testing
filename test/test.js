const chai = require('chai')
const expect = chai.expect
const spawn = require('child_process').spawn

const testScriptPath = process.env.TEST_SCRIPT_PATH === undefined ? './tsqllint.js' : process.env.TEST_SCRIPT_PATH

describe('Command Line', () => {
  describe('Exit Code', () => {
    it('Should be zero when no arguments are passed', (done) => {
      var consoleOutput
      SpawnTestProcess([], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(0)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be zero when passed -h argument', (done) => {
      var consoleOutput
      SpawnTestProcess(['-h'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(0)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be zero when passed invalid file path argument', (done) => {
      var consoleOutput
      SpawnTestProcess(['./doesntexist/foo.sql'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(0)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be zero when passed a file that passes linting rules', (done) => {
      var consoleOutput
      SpawnTestProcess(['./test/sql/ignore-rules.sql'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(0)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be one when passed an invalid argument', (done) => {
      var consoleOutput
      SpawnTestProcess(['-foo'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(1)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be one when passed a file that doesnt pass linting rules', (done) => {
      var consoleOutput
      SpawnTestProcess(['./test/sql/select-star.sql'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(1)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })

    it('Should be one when passed a directory that doesnt pass linting rules', (done) => {
      var consoleOutput
      SpawnTestProcess(['./test/sql'], consoleOutput).on('exit', function (code) {
        expect(code).to.equal(1)
        expect(consoleOutput).to.not.be.null
        done()
      })
    })
  })
})

function SpawnTestProcess (args, consoleOutput, writeToConsole = false) {
  var testProcess = spawn(testScriptPath, args)

  testProcess.stdout.on('data', function (data) {
    if (writeToConsole) process.stdout.write(data)
    consoleOutput += data
  })

  testProcess.stderr.on('data', function (data) {
    if (writeToConsole) process.stdout.write(data)
    consoleOutput += data
  })

  return testProcess
}
