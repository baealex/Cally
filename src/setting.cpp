#include "setting.h"
#include "ui_setting.h"
#include "ui_mainform.h"
#include <QDesktopServices>

Setting::Setting(MainForm &ref, QWidget *parent) :
    QDialog(parent),
    Mainref(ref),
    ui(new Ui::Setting)
{
    setWindowFlags(Qt::Dialog | Qt::MSWindowsFixedSizeDialogHint);
    setWindowFlags(this->windowFlags() & ~Qt::WindowContextHelpButtonHint);

    ui->setupUi(this);

    SettingData setData;
    ui->opacity_bar->setValue(setData.Opacity);
    if(setData.Auto_Start==1)
    {
        ui->AutoStartCheck->setChecked(true);
    }
}

Setting::~Setting()
{
    delete ui;
}

void Setting::on_AutoStartCheck_stateChanged(int arg1)
{
    QFileInfo fileInfo(QCoreApplication::applicationFilePath());
    QString startDir = QStandardPaths::writableLocation(QStandardPaths::ApplicationsLocation)
            + QDir::separator() + "Startup"
            + QDir::separator() + fileInfo.completeBaseName() + ".lnk";

    if(AutoStart == false)
    {
        QFile::link(QCoreApplication::applicationFilePath(),startDir);
        AutoStart = true;

        SettingData setData;
        setData.Auto_Start=1;
        setData.SAVE();
    }
    else
    {
        QFile file(startDir);
        file.remove();
        AutoStart = false;

        SettingData setData;
        setData.Auto_Start=0;
        setData.SAVE();
    }
}

void Setting::on_opacity_bar_valueChanged(int value)
{
    Mainref.setWindowOpacity((double)value/100);

    SettingData setData;
    setData.Opacity = value;
    setData.SAVE();
}

void Setting::on_picture_btn_clicked()
{
    m_fileName = QFileDialog::getOpenFileName(this, "Select IMG File.", "", tr("Image (*.jpg *.jpeg *.jpe *.png *pns) ;; GIFs(*.gif)"));

    IMGData mIMG;
    mIMG.LINK = m_fileName;
    mIMG.SAVE();

    Mainref.mIMG_LOAD();
}

void Setting::on_homepage_btn_clicked()
{
    QDesktopServices::openUrl(QUrl("http://baealex.tistory.com"));
}

void Setting::on_update_btn_clicked()
{
    QDesktopServices::openUrl(QUrl("https://www.dropbox.com/s/262nvtsmdo5t91d/IUCalendar.exe?dl=1"));
}

void Setting::on_pushButton_clicked()
{
    close();
}

void Setting::mousePressEvent(QMouseEvent *event) {
   if (event->button() == Qt::LeftButton && event->localPos().y() >= 0 && event->localPos().y() <= 30) {
      m_nMouseClick_X_Coordinate = event->x();
      m_nMouseClick_Y_Coordinate = event->y();
      isMouseDown = true;
   }
}

void Setting::mouseReleaseEvent(QMouseEvent *event) {
   isMouseDown = false;
}

void Setting::mouseMoveEvent(QMouseEvent *event) {
   if (isMouseDown == true) {
      move(event->globalX()-m_nMouseClick_X_Coordinate,event->globalY()-m_nMouseClick_Y_Coordinate);
   }
}
