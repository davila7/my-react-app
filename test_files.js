// Find the duplicate files under some filesystem path.
// For each set of duplicates, output a list of filepaths.
//
// Example output:
// [
//  ["a/file1.mp4", "a/file1_copy.mp4"],
//  ["a/file3.mp4", "b/c/file3b.mp4", "d/foo.mp4"]
// ]
//
// You can create files to test with:
// - The UI on the left (click the folder icon in the toolbar), or
// - Using shell commands in the console (click the ⊞ on the left and type shell)

const fs = require("fs");
const path = require("path");

var findDuplicate = async function () {
  let return_array = [];

  // Get all the files
  let directory = "./test_folder";

  const files = await Promise.all(
    fs.readdirSync(directory, { withFileTypes: true }).map((file) => {
      const res = path.resolve(directory, file.name);
      return file.isDirectory() ? getFiles(res) : res;
    }),
  );

  // Get the contents
  // [
  //    [file, content],
  //    [file2, content2],
  // ]
  let return_files_content = [];
  for (const file of files) {
    return_files_content.push([file, await readFile(file)]);
  }

  // compare the contents
  for (let i = 0; i < return_files_content.length; i++) {
    for (let j = i + 1; j < return_files_content.length; j++) {
      if (return_files_content[i][1].equals(return_files_content[j][1])) {
        return_array.push([return_files_content[i][0], return_files_content[j][0]]);
      }
    }
  }

  return return_array;
};



function readFile(name) {
  return new Promise((resolve, reject) =>
    fs.readFile(name, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    }),
  );
}

findDuplicate();
