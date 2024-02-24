const details = () => {
    return {
        id: "Tdarr_Plugin_rm01_batch_clean_filenames",
        Stage: "Post-processing",
        Name: "Filter And Clean Up Filenames In A Directory",
        Type: 'Any',
        Operation: 'Transcode',
        Description: `
                        This plugin simply searches the source file directory for any files that match any of the extension terms.
                        If there are subdirectories, it will recursively search those as well to find the files that match.
                        Keeping relative paths in mind, if the matched file isn't the file that Tdarr is currently tracking,
                        it will copy the file over to the output directory before processing the file. It will then rename the
                        files that matched the desired extensions to the library's output directory, removing any terms that
                        were matched by any of the rename regex terms.

                        This plugin is particular useful if you want to clean supplementary files, such as subtitles and the like,
                        along with your video file name for consistency's sake.
                    `,
        Version: "1.00",
        Tags: "ffmpeg,handbrake,post-processing,configurable,filter,action",
        Inputs: [
            {
                name: 'Extensions_To_Filter',
                type: 'string',
                defaultValue: 'mkv,ass,srt',
                inputUI: {
                    type: 'text'
                },
                tooltip:
                    `
                        Input Any File Extensions You Would Like To Filter For.\\n
                        This Should Be A Comma Delimited List.\\n
                        Example:\\n
                        'txt,srt,mkv'
                        'ass,mp4'\\n
                    `
            },
            {
                name: 'Try_To_Filter_Known_Video_Codecs',
                type: 'boolean',
                defaultValue: true,
                inputUI: {
                    type: 'toggle',
                },
                tooltip: `Toggle Whether To Clean Any Potential Stand-Alone Video Codec Terms In File Name - Default Is Enabled
                    \\n\\n
                    Codecs That Will Be Searched:\\n
                    - h261\\n
                    - h262\\n
                    - h263\\n
                    - h264\\n
                    - h265\\n
                    - avc\\n
                    - hevc\\n
                    - vp8\\n
                    - vp9\\n
                    - av1\\n
                    - divx\\n
                    - xvid\\n
                    - rv9\\n
                    - RealVideo 9\\n
                    - rv10\\n
                    - RealVideo 10\\n
                    - wmv\\n
                    - Windows Media Video\\n
                    - Sorenson Video\\n
                    - Cinepak\\n
                    - Indeo Video\\n
                    - Theora\\n
                    - MPEG-1\\n
                    - MPEG-2\\n
                    - MPEG-3\\n
                    - MPEG-4\\n
                    - MPEG-4 Part 2\\n
                `
            },
            {
                name: 'Try_To_Filter_Known_Audio_Codecs',
                type: 'boolean',
                defaultValue: true,
                inputUI: {
                    type: 'toggle',
                },
                tooltip:
                    `
                        Toggle Whether To Clean Any Potential Stand-Alone Audio Codec Terms In File Name - Default Is Enabled
                        \\n\\n
                        Codecs That Will Be Searched:\\n
                        - aac\\n
                        - mp3\\n
                        - eac\\n
                        - ac3\\n
                        - wma\\n
                        - ogg\\n
                        - flac\\n
                        - opus\\n
                        - pcm\\n
                        - aiff\\n
                        - alac\\n
                        - wav\\n
                        - dts\\n
                        - amr\\n
                        - ape\\n
                        - midi\\n
                        - ape\\n
                        - speex\\n
                        - wma pro\\n
                        - mp3 surround\\n
                        - dolby truehd\\n
                        - dolby atmos\\n
                        - dts:x\\n
                        - dts-hd ma\\n
                        - dts-hd es\\n
                        - dts-hd hra\\n
                        - dts express\\n
                        - dolby digital\\n
                    `
            },
            {
                name: 'Terms_To_Filter',
                type: 'string',
                defaultValue: '',
                inputUI: {
                    type: 'text'
                },
                tooltip:
                    `
                                Input Any Custom Regex Terms You Would Like To Filter For.\\n
                                This Should Be A Comma Delimited List. Word boundaries will be added to each term for you.\\n
                                NOTE: This will be case insensitive and global. This will also run after the erasure of codec terms\\n
                                and will be applied to the filename after the codec terms have been removed.\\n
                                \\n
                                Example:\\n
                                'h265,h264,aac,truehd,remux'\\n
                                '[h265][1080p]'
                            `
            },
        ],
    };

};


// This function returns a regex that matches the audio and video codecs to be removed from the filename based on the user's input for the settings.
// If the user has specified custom terms, they will be added to the regex as well. If the user has not selected to remove audio or video codecs,
// the function will return an empty regex.
//
// The audioCodecRegex searches for any audio codec that is commonly found in filenames as well as some less common ones as well as the variations of
// the codecs. This regex also handles the case where the codec is followed by an audio channel count.
//
// The videoCodecRegex searches for any video codec that is commonly found in filenames as well as some less common ones and adds in variations of the codecs.
function GetRegex(cleanAudio, cleanVideo) {
    const regBoundary = '\\b';
    const audioCodecRegex = '(AAC|MP2(?:\\.5)?|MP3(?: Surround)?|MP4(?:A|ALS)?|AC3|WMA|OGG Vorbis|FLAC|Opus|PCM|AIFF|ALAC|WAV|DTS(?:-HD MA|-HD ES|-HD HRA| Express)?|AMR|APE|MIDI|Speex|WMA Pro|MP3 Surround|Dolby TrueHD|Dolby Atmos|DTS:X)(?:\\s*\\d\\.\\d)';
    const videoCodecRegex = '(H\\.261|x261|H261|H\\.262|x262|H262|H\\.263|H263|x263|H\\.264|x264|H264|H\\.265|x265|H265|VP8|VP9|AV1|MPEG-4|MPEG-4 Part 2|Theora|DivX|Xvid|RV9|RealVideo 9|RV10|RealVideo 10|WMV|Windows Media Video|Sorenson Video|Cinepak)';
    let regex = new RegExp('');
    if (cleanAudio && cleanVideo) {
        regex = new RegExp(regBoundary + audioCodecRegex + regBoundary + '|' + regBoundary + videoCodecRegex + regBoundary, 'gi');
    } else if (cleanVideo) {
        regex = new RegExp(regBoundary + videoCodecRegex + regBoundary, 'gi');
    } else if (cleanAudio) {
        regex = new RegExp(regBoundary + audioCodecRegex + regBoundary, 'gi');
    }
    return regex;
}

// This function returns a regex that matches the user's custom terms to be removed from the filename.
// If the user has not specified any custom terms, the function will return an empty regex.
//
// The function will also validate the user's terms and throw an error if any of the terms are invalid. The
// basis for the validation is to ensure that the file won't be left in an invalid state after the user's
// terms are removed, so throwing an error is the best way to handle this and stop the plugin from running.
function GetUserRegex(customTerms) {
    let customTermsRegex = '';
    customTerms = customTerms.split(',');
    customTermsRegex = customTerms.map(term => {
        // Validate each user term
        if (term.includes('.') || term.includes('/') || term.includes('\\')) {
            throw new Error(`Invalid user term: ${term}. User terms cannot contain '.', '/', or '\\' characters.`);
        }
        if (term.startsWith('*') || term.endsWith('*')) {
            throw new Error(`Invalid user term: ${term}. User terms cannot start or end with '*' wildcard.`);
        }
        // Check if the user's term would change the container of a file
        if (term.includes('.')) {
            throw new Error(`Invalid user term: ${term}. User terms cannot change the container of a file.`);
        }
        // Check if the user's term would remove any part of the extension of a file
        if (term.startsWith('.') || term.endsWith('.')) {
            throw new Error(`Invalid user term: ${term}. User terms cannot remove any part of the extension of a file.`);
        }
        // Escape special characters in the user's term
        term = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Add word boundaries to the user's term before joining them with '|'
        term = '\\b' + term + '\\b';
        return term;
    }).join('|');
    return new RegExp(customTermsRegex, 'gi');
}


function NormalizePath(filePath) {
    const path = require('path');
    return String(filePath.split(path.sep).join('/'));
}

// This function checks if the directory path is valid and exists.
// If it is, it returns true, else it returns false.
function ValidatePath(directory) {
    const fs = require('fs');
    try {
        fs.accessSync(NormalizePath(directory));
        return true;
    } catch (error) {
        return false;
    }
}


function CreateDirectories(dirPath) {
    const fs = require('fs');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(NormalizePath(dirPath), { recursive: true });
    }
    return true;
}


function RenameFile(oldFilePath, filterAudio, filterVideo, userRegex, response) {
    const fs = require('fs');
    const path = require('path');
    let filename = path.basename(oldFilePath);// copy the original to modify
    filename = filename.replace(GetRegex(filterAudio, filterVideo), '');
    filename = filename.replace(userRegex, '');
    let newFilePath = path.join(path.dirname(oldFilePath), filename);
    response.infoLog += `- Renamed [${path.basename(oldFilePath)}] to [${filename}]\\n\\n`;
    if (path.basename(oldFilePath) === path.basename(response.file.file)) {
        // processing a file that the application tracks
        response.file.file = newFilePath;
        response.updateDB = true;
        response.infoLog += `- Updated Tdarr File Object To Reflect New File Path\\n\\n`;
    }
    fs.renameSync(oldFilePath, newFilePath);
}

function IsVideoFile(file) {
    const fs = require('fs');
    const path = require('path');
    const extension = path.extname(file).toLowerCase().slice(1);
    const videoExtensions = [
        '3g2', '3gp', 'asf', 'avi', 'divx', 'flv', 'm2ts', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'mts', 'ogv', 'rm', 'vob', 'webm', 'wmv', 'xvid',
        // Additional less common video file extensions
        'amv', 'bik', 'dash', 'evo', 'f4v', 'h264', 'm1v', 'm2v', 'mj2', 'mjp', 'ogm', 'qt', 'rmvb', 'tp', 'ts', 'yuv',
    ];
    if (!videoExtensions.includes(extension)) {
        return false;
    }

    // If Tdarr has support for file-type, we can change this back and use it to check if the file is a video file
    // const buffer = Buffer.alloc(4100);
    // const fd = fs.openSync(file, 'r');
    // fs.readSync(fd, buffer, 0, buffer.length, 0);
    // fs.closeSync(fd);
    // const fileTypeResult = fileType(buffer);
    // return fileTypeResult && fileTypeResult.mime.startsWith('video/');

    const videoLeadingBytes = [
        '00000018', '00000020', '66747970', '4d546864',
        '52494646', '4d524f46', '3026b275', '1a45dfa3',
        '000001ba', '000001b3', '4f676753', '7b5b5d7d',
        '38425053', '89504e47', '47494638', '49492a00',
        '4d4d002a', 'ffd8ffe0', '49443303', '52494646',
        '464c5601', '00000100', '000001b0', '664c6143',
        '2321414d', '25215053', '49492a00', '4d4d002a',
        'ffd8ffe0', '49443303', '52494646', '464c5601',
        '00000100', '000001b0', '664c6143', '2321414d',
        '25215053'
    ];
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(file, 'r');
    fs.readSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);
    const leadingBytes = buffer.toString('hex');
    return videoLeadingBytes.includes(leadingBytes);
}

function ProcessFile(fullPath, filterAudio, filterVideo, userRegex, libSettings, response, workingDir) {
    const fs = require('fs');
    const path = require('path');
    let currentFileInDir = path.basename(fullPath);
    // relativePathToFile gives me the chunk of the path minus the source root directory
    // relativeOutputPath gives me the chunk of the path minus the output root directory
    // I can then join the output root directory with the relative output path to get the full output path
    let relativePathToFile = NormalizePath(path.relative(libSettings.folder, fullPath));
    let relativeOutputPath = NormalizePath(path.relative(libSettings.output, relativePathToFile));
    let fullOutputPath = NormalizePath(path.join(libSettings.output, relativeOutputPath));
    let outputDir = NormalizePath(path.dirname(fullOutputPath)); // The output directory to copy the cleaned files to

    // Get the full path to the working directory and add the current file to the path
    let workingFilePath = NormalizePath(path.join(path.dirname(workingDir), currentFileInDir));

    if (!(ValidatePath(outputDir))) {
        response.infoLog += `\\nThe directory path ${outputDir} is invalid or does not exist.\\nTrying To Create Missing Directories\\n`;
        if (!CreateDirectories(outputDir)) {
            response.infoLog += `An error occurred when trying to add missing directories to path ${outputDir}: ${error.message}\\n`;
            return; // If the directory path is invalid, return early and skip this entry
        }
    }
    // The output directory path exists and is valid, so we can proceed with the file processing
    let actualTdarrFile = path.basename(NormalizePath(response.file.file));

    if (currentFileInDir !== actualTdarrFile) {
        if (IsVideoFile(fullPath)) {
            response.infoLog += `- [${currentFileInDir}] Is A Video File Possibly Tracked By Tdarr, But Not The File We Are Currently Concerned With - Skipping.\\n`;
            return;
        } else {
            response.infoLog += `- [${currentFileInDir}] Is Not A Video File - Copying File Over To Work On\\n`;
            if(!ValidatePath(path.dirname(workingFilePath)))
            {
                response.infoLog += `\\nThe directory path ${path.dirname(workingFilePath)} is invalid or does not exist.\\nTrying To Create Missing Directories\\n`;
                if (!CreateDirectories(path.dirname(workingFilePath))) {
                    response.infoLog += `An error occurred when trying to add missing directories to path ${path.dirname(workingFilePath)}: ${error.message}\\n`;
                    return; // If the directory path is invalid, return early and skip this entry
                }
            }
            if(!fs.existsSync(workingFilePath)){
                fs.copyFileSync(fullPath, workingFilePath);
            }else{
                response.infoLog += `- [${currentFileInDir}] Already Exists In The Working Directory\\n`;
            }
           // fs.copyFileSync(fullPath, fullOutputPath);
        }
    } else {
        response.infoLog += `- [${currentFileInDir}] Is The File We Are Currently Concerned With In This Track\\n`;
        if(!fs.existsSync(workingFilePath)){
            fs.copyFileSync(fullPath, workingFilePath);
        }else{
            response.infoLog += `- [${currentFileInDir}] Already Exists In The Working Directory\\n`;
        }
    }
    RenameFile(workingFilePath, filterAudio, filterVideo, userRegex, response);
    // RenameFile(fullOutputPath, filterAudio, filterVideo, userRegex, response);
}

function ProcessDirectory(directoryPath, allFilesInDir, extensions, filterAudio, filterVideo, userRegex, libSettings, response, workingDir) {
    const fs = require('fs');
    const path = require('path');

    allFilesInDir.forEach(currentFileInDir => {
        const fullPath = NormalizePath(path.join(directoryPath, currentFileInDir));
        const fileStats = fs.statSync(fullPath);
        if (fileStats.isDirectory()) {
            response.infoLog += `- [${currentFileInDir}] Is A Directory - Beginning Recursive Search\\n`;
            ScanDirectory(fullPath, extensions, filterAudio, filterVideo, userRegex, libSettings, response, workingDir);
        } else if (fileStats.isFile()) {
            response.infoLog += `- [${currentFileInDir}] Is A File - Processing [${currentFileInDir}]\\n`;
            if (extensions.includes(path.extname(currentFileInDir))) {
                response.infoLog += `- [${currentFileInDir}] Matched For Extension List Filtering\\n`;
                ProcessFile(fullPath, filterAudio, filterVideo, userRegex, libSettings, response, workingDir);
            } else {
                response.infoLog += `- Skipping File [${currentFileInDir}] (Does Not Match Extension List)\\n`;
            }
        } else {
            response.infoLog += `- Skipping Object [${currentFileInDir}] (Not A Directory or File)\\n`;
        }
    });
}


function ScanDirectory(directory, extensions, filterAudio, filterVideo, userRegex, libSettings, response, workingDir) {
    const fs = require('fs');
    const path = require('path');
    response.infoLog += `\\n\\nScanning Directory [${path.basename(directory)}] For Files That Match Extension List [${extensions.join(',')}]\\n`;
    const allFilesInDir = fs.readdirSync(directory);
    if (allFilesInDir) {
        ProcessDirectory(directory, allFilesInDir, extensions, filterAudio, filterVideo, userRegex, libSettings, response, workingDir);
    } else {
        response.infoLog += `\\n- No files found in directory: ${directory}\\n`;
    }
}


const plugin = (file, libSettings, inputs, otherArguments) => {
    const path = require('path');
    const lib = require('../methods/lib')();
    inputs = lib.loadDefaultValues(inputs, details);

    var response = {
        processFile: false,
        preset: '',
        container: `.${file.container}`,
        handBrakeMode: false,
        FFmpegMode: false,
        infoLog: '',
        file: file,
        removeFromDB: false,
        updateDB: false,
    };

    // user defined settings
    const filterAudio = inputs.Try_To_Filter_Known_Audio_Codecs;
    const filterVideo = inputs.Try_To_Filter_Known_Video_Codecs;
    const userRegex = GetUserRegex(inputs.Terms_To_Filter);
    // Sanitize and then normalize the extensions to filter
    const extensions = inputs.Extensions_To_Filter.split(',')
    .map(extension => extension.trim().replace('.', ''))
    .map(extension => '.' + extension);
    let workingFilePath = otherArguments.cacheFilePath;
    response.infoLog += `Working Directory: ${workingFilePath}\\n\\n`;
    ScanDirectory(NormalizePath(path.dirname(file.file)), extensions, filterAudio, filterVideo, userRegex, libSettings, response, workingFilePath);
    return response;

};

module.exports.IsVideoFile = IsVideoFile;
module.exports.GetRegex = GetRegex;
module.exports.GetUserRegex = GetUserRegex;
module.exports.NormalizePath = NormalizePath;
module.exports.ValidatePath = ValidatePath;
module.exports.CreateDirectories = CreateDirectories;
module.exports.RenameFile = RenameFile;
module.exports.ProcessFile = ProcessFile;
module.exports.ProcessDirectory = ProcessDirectory;
module.exports.ScanDirectory = ScanDirectory;
module.exports.plugin = plugin;
module.exports.details = details;
