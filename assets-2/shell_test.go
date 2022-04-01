package shell

import (
	"fmt"
	"os"
	"path"
	"testing"
)

func TestCmd(t *testing.T) {
	out, err := Cmd("ls -lah", true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(out))
}

func TestFfmpeg(t *testing.T) {
	ffmpeg := "\"C:\\Program Files\\ImageMagick-7.0.10-Q16-HDRI\\ffmpeg.exe\""
	cwd, _ := os.Getwd()
	out, err := Cmd(fmt.Sprintf("%s -i \"%s\" -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls \"%s\"",
		ffmpeg,
		path.Join(cwd, "temp/oceans.mp4"),
		path.Join(cwd, "temp/out.m3u8")),
		true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(out))
}

func TestRunCommandAndGetOutput(t *testing.T) {
	const (
		username = "root"
		password = ""
		ip       = "120.79.199.204"
		port     = 22
	)

	Shell, err := NewRemoteShell(username, password, ip, "C:\\Users\\j\\AppData\\Roaming\\Sublime Text 3\\Packages\\User\\Notes\\keys/id",  port, nil)

	if err != nil {
		fmt.Println(err)
		return
	}

	output, err := Shell.RunCommandAndGetOutput("ls -lah")
	if err != nil {
		return
	}
	fmt.Println(output)


	output, err = Shell.RunCommandAndGetOutput("ps aux")
	if err != nil {
		return
	}
	fmt.Println(output)


	output, err = Shell.RunCommandAndGetOutput("df -h")
	if err != nil {
		return
	}
	fmt.Println(output)

}
