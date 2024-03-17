var minMemory = "0";
var maxMemory = "10 MB"
var currentDiskSpace = 0;
var diskSize = 10 * 1024 * 1024; // 10 MB for testing
var currentPercent = 0;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("used-memory").innerHTML = ((currentDiskSpace / 1024 / 1024) + "").substring(0,5) + " MB";
    document.getElementById("min-memory").innerHTML = minMemory;
    document.getElementById("max-memory").innerHTML = maxMemory;
    document.getElementById("memory-left").innerHTML = "<p>" + (parseInt(maxMemory) - currentDiskSpace) + " <span>MB left</span></p>";
});


function handleFiles(files) {
    var allowedFormats = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    var filePreviewContainer = document.getElementById('filePreviewContainer');
    var filePreviews = {}; 
    var totalSize = 0;

   
    function createFilePreview(file, fileId) {
       
        var fileName = file.name;
        var fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
        var nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
        var truncatedName = nameWithoutExtension.length > 7 ? nameWithoutExtension.substring(0, 7) + '...' : nameWithoutExtension;

 
        var filePreview = document.createElement('div');
        filePreview.className = 'file-preview';
        filePreview.textContent = truncatedName + '.' + fileExtension;
        filePreview.id = 'preview-' + fileId; 

        
        var deleteIndicator = document.createElement('span');
        deleteIndicator.className = 'delete-indicator';
        deleteIndicator.textContent = 'x';

        
        filePreview.appendChild(deleteIndicator);

        
        filePreviewContainer.appendChild(filePreview);

        
        deleteIndicator.addEventListener('click', function() {
            filePreviewContainer.removeChild(filePreview);
            delete filePreviews[fileId]; 
            document.getElementById('fileInput').value = ''; 
            currentDiskSpace -= file.size;
            move();
            if(currentDiskSpace == 0){
                document.getElementById("memory-left").innerHTML = "<p>" + parseInt(maxMemory)  + " <span>MB left</span></p>"; 
            }
        });
        
            filePreviews[fileId] = filePreview;
    }
 
    Array.from(files).forEach(function(file) {
        if (!allowedFormats.test(file.name)) {
            alert('File format isn\'t supported.\nNote: Allowed file formats: .jpeg, .jpg, .gif, .png');
            return;
        }
        totalSize += file.size;
    });

 
    if (currentDiskSpace + totalSize > diskSize) {
        alert('There is not enough space on the disk.');
    } else {
    Array.from(files).forEach(function(file, index) {
        var fileId = 'file-' + Date.now() + '-' + index; 
          
          createFilePreview(file, fileId);
          currentDiskSpace += file.size;
          move();
        });
    };
} 
 
    if(document.getElementById('fileInput') != null){
        document.getElementById('fileInput').addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });
    }
function updateHTML(elementName, value){
    document.getElementById(elementName).innerHTML = value;  
}   
var i = 0;
function move() {
    var elem = document.getElementById("progress-bar");
    currentPercent = currentDiskSpace/diskSize*100;

    if(currentPercent == 0){
        currentPercent = 0.5;
    }
    document.getElementById("used-memory").innerHTML = ((currentDiskSpace / 1024 / 1024) + "").substring(0,5) + " MB";
    elem.style.width = currentPercent + "%";
    document.getElementById("memory-left").innerHTML = "<p>" + (parseFloat(maxMemory) - currentDiskSpace /1024 /1024).toFixed(1)  + " <span>MB left</span></p>";
}

