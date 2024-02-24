function test_libSettings() {
return libSettings = {
    "_id": "123456789",
    "priority": 0,
    "name": "Anime",
    "folder": "E:/Dev/Tdarr_Plugins/Batch_Clean_Files_Plugin/Testing/Mock_Folder_Structure/Qbit/Downloads/Anime",
    "foldersToIgnore": "",
    "folderWatchScanInterval": "180",
    "scannerThreadCount": "8",
    "cache": "E:/Dev/Tdarr_Plugins/Batch_Clean_Files_Plugin/Testing/Mock_Folder_Structure/tdarr/tdarr_cache/",
    "output": "E:/Dev/Tdarr_Plugins/Batch_Clean_Files_Plugin/Testing/Mock_Folder_Structure/tdarr/tdarr_transcodes/Anime/",
    "folderToFolderConversion": true,
    "folderToFolderConversionDeleteSource": false,
    "folderToFolderRecordHistory": true,
    "copyIfConditionsMet": true,
    "container": ".mkv",
    "containerFilter": "mkv,mp4,mov,m4v,mpg,mpeg,avi,flv,webm,wmv,vob,evo,iso,m2ts,ts",
    "createdAt": 1675837380368,
    "folderWatching": true,
    "useFsEvents": false,
    "scheduledScanFindNew": true,
    "processLibrary": true,
    "processTranscodes": true,
    "processHealthChecks": true,
    "scanOnStart": true,
    "exifToolScan": true,
    "mediaInfoScan": true,
    "closedCaptionScan": true,
    "scanButtons": true,
    "scanFound": "Files found:0",
    "navItemSelected": "navSourceFolder",
    "pluginIDs": [],
    "pluginCommunity": true,
    "handbrake": true,
    "ffmpeg": false,
    "handbrakescan": false,
    "ffmpegscan": true,
    "preset": "-Z \"Fast 1080p30\"",
    "decisionMaker": {
        "settingsPlugin": false,
        "settingsVideo": false,
        "videoExcludeSwitch": true,
        "video_codec_names_exclude": [
            {
                "codec": "hevc",
                "checked": false
            },
            {
                "codec": "h264",
                "checked": true
            }
        ],
        "video_size_range_include": {
            "min": 0,
            "max": 100000
        },
        "video_height_range_include": {
            "min": 0,
            "max": 3000
        },
        "video_width_range_include": {
            "min": 0,
            "max": 4000
        },
        "settingsAudio": false,
        "audioExcludeSwitch": true,
        "audio_codec_names_exclude": [
            {
                "codec": "mp3",
                "checked": true
            },
            {
                "codec": "aac",
                "checked": false
            }
        ],
        "audio_size_range_include": {
            "min": 0,
            "max": 10
        },
        "settingsFlows": true
    },
    "schedule": [
        {
            "_id": "Sun:00-01",
            "checked": true
        },
    ],
    "totalHealthCheckCount": 0,
    "totalTranscodeCount": 815,
    "sizeDiff": 977.8674234645441,
    "holdNewFiles": false,
    "holdFor": 3600,
    "pluginStackOverview": true,
    "filterResolutionsSkip": "",
    "filterCodecsSkip": "",
    "filterContainersSkip": "",
    "processPluginsSequentially": true,
    "flowId": "e8MNZTPLF"
}
}
module.exports.test_libSettings = test_libSettings;