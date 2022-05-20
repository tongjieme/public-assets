package fs

import (
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"
)

// ListFiles return a list like C:\_github\go-utils\fs, C:\_github\go-utils\fs
func ListFiles(path string, isFile bool, isDir bool) (files []string, err error) {
	err = filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if isFile && !info.IsDir() {
			files = append(files, path)
		}
		if isDir && info.IsDir() {
			files = append(files, path)
		}

		return nil
	})
	return
}

func ReadFile(path string) (str string, err error) {
	content, err := ioutil.ReadFile(path)
	return string(content), err
}

func WriteFile(path string, content string) (err error) {

	err = EnsureFile(path, 0777)
	if err != nil {
		return
	}

	return ioutil.WriteFile(path, []byte(content), 0666)
}

// Exists test if path Exists
func Exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

// IsDir test path is a dir
func IsDir(path string) (bool, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false, err
	}

	if fileInfo.IsDir() {
		return true, nil
	} else {
		return false, nil
	}
}

func DeleteFileIfExists(path string) (err error) {
	exist, err := Exists(path)
	if err != nil {
		return err
	}
	if exist {
		return os.RemoveAll(path)
	}
	return
}

func EnsureDir(dirPath string, perm os.FileMode) error {
	return os.MkdirAll(dirPath, perm)
}

func EnsureFile(p string, perm os.FileMode) error {
	exists, err := Exists(p)
	if err != nil {
		return err
	}
	if !exists {
		if err := os.MkdirAll(filepath.Dir(p), perm); err != nil {
			return err
		}
		f, err := os.Create(p)
		if err != nil {
			defer f.Close()
		}

		return err
	}

	return err
}

// GetFileSize get file in bytes
func GetFileSize(filepath string) (int64, error) {
	fi, err := os.Stat(filepath)
	if err != nil {
		//fmt.Println("name:",fi.Name())
		//fmt.Println("size:",fi.Size())
		//fmt.Println("is dir:",fi.IsDir())
		//fmt.Println("mode::",fi.Mode())
		//fmt.Println("modTime:",fi.ModTime())
		return 0, err
	}
	if fi.IsDir() {
		return 0, errors.New(filepath + " is a dir")
	}

	return fi.Size(), nil
}
