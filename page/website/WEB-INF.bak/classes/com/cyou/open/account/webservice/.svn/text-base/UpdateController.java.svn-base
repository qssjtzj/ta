package com.cyou.open.account.webservice;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.cyou.common.utils.FileUtil;
import com.cyou.common.utils.PropertiesLoader;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/user/update")
public class UpdateController {
	
	/**
	 * 上传图片
	 * @param session
	 * @param request
	 * @param response
	 * @param uid
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/upload", method = RequestMethod.POST,produces=MediaType.TEXT_HTML_VALUE)
	public Object upload(HttpSession session, HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "uid") String uid) throws IOException {

		String x1 = request.getParameter("x1");
		String x2 = request.getParameter("x2");
		String y1 = request.getParameter("y1");
		String y2 = request.getParameter("y2");
//		System.out.println("-------------------" + x1+" ,"+ x2+" , "+ y1+" ,"+ y2);
	
		Properties pro = PropertiesLoader.loadProperties("resource.properties");
		String path = pro.getProperty("ImagePath");
		String m_host = pro.getProperty("ImageHost");
		String base_path = pro.getProperty("base.path");
		
//		String lpath = path + "/" + uid + ".png";
		
		String name=uid + ".png";
		String temp_path = path + "/temp/";
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(x1!=null && x2!=null  && y1!=null  && y2!=null ){
			
			try {
				readUsingImageReader(temp_path+name, path+"/"+name, Integer.parseInt(x1), Integer.parseInt(x2), Integer.parseInt(y1), Integer.parseInt(y2));
				String uri = base_path + m_host + "/" +name;
				
				retMap.put("user_success", true);
				retMap.put("img", uri);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}else{
			
			try {
				File file = new File(temp_path);
				FileUtil.mkdir(temp_path);
				FileUtil.upload(request, file, name);
	
				String uri = base_path + m_host + "/temp/" + uid + ".png";
				retMap.put("user_success", true);
				retMap.put("img", uri);
	
			} catch (Exception e) {
	
			}
		}

		ObjectMapper mapper = new ObjectMapper();
		String renderStr = mapper.writeValueAsString(retMap);
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}

	/**
	 * 获取图片类型 png jpg等
	 * @param o
	 * @return
	 */
	public static String getFormatName(Object o) {
		try {
	    	ImageInputStream iis = ImageIO.createImageInputStream(o);
	        Iterator<ImageReader> iter = ImageIO.getImageReaders(iis);
	        if (!iter.hasNext()) {
	        	return null;
	        }
	        ImageReader reader = iter.next();
	        iis.close();
	        return reader.getFormatName();
	    } catch (IOException e) {
	    }
	    return null;
	}
	
	/**
	 * 图片截取
	 * @param s_img
	 * @param to_img
	 * @param x1
	 * @param x2
	 * @param y1
	 * @param y2
	 * @throws IOException
	 */
	public static void readUsingImageReader(String s_img, String to_img, int x1,int x2, int y1, int y2) 
		throws IOException{
		
		File f = new File(s_img);
		String fileFormat = getFormatName(f);
		if(fileFormat==null){
			fileFormat="png";
		}
		
		// 取得图片读入器
		Iterator readers = ImageIO.getImageReadersByFormatName(fileFormat);
		ImageReader reader = (ImageReader) readers.next();
		// 取得图片读入流
		InputStream source = new FileInputStream(s_img);
		
		ImageInputStream iis = ImageIO.createImageInputStream(source);
		reader.setInput(iis, true);
		ImageReadParam param = reader.getDefaultReadParam();
		
		int w = x2-x1;
		int h = y2-y1;
		Rectangle rect = new Rectangle(x1, y1, w, h);
		
		param.setSourceRegion(rect);
		BufferedImage bi = reader.read(0, param);
		
		//bi.getGraphics().drawImage(bi, 0, 0, 100, 100, null);
		//等比缩放
		//bi = resize(bi,100,100);
		
		BufferedImage buffImg = null;  
        buffImg = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);  
        buffImg.getGraphics().drawImage(  
                bi.getScaledInstance(100, 100, Image.SCALE_SMOOTH), 0,  
                0, null);  
        ImageIO.write(buffImg, "png", new File(to_img));
		//ImageIO.write(bi, "png", new File(to_img));
		
	}
	
	/*** 
     * 功能 :调整图片大小 
     * @param srcImgPath 原图片路径 
     * @param distImgPath  转换大小后图片路径 
     * @param width   转换后图片宽度 
     * @param height  转换后图片高度 
     */  
	public static void resizeImage(String srcImgPath, String distImgPath,  
            int width, int height) throws IOException {  
  
        File srcFile = new File(srcImgPath);  
        Image srcImg = ImageIO.read(srcFile);  
        BufferedImage buffImg = null;  
        buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);  
        buffImg.getGraphics().drawImage(  
                srcImg.getScaledInstance(width, height, Image.SCALE_SMOOTH), 0,  
                0, null);  
  
        ImageIO.write(buffImg, "JPEG", new File(distImgPath));  
  
    }  
	
	/** 
     * 改变图片的尺寸
     *  
     * @param source   源文件 
     * @param targetW  目标长 
     * @param targetH   目标宽 
     */  
    public static BufferedImage resize(BufferedImage source, int targetW, int targetH) throws IOException  {  
        int type = source.getType();  
        BufferedImage target = null;  
        double sx = (double) targetW / source.getWidth();  
        double sy = (double) targetH / source.getHeight();  
        // 这里想实现在targetW，targetH范围内实现等比缩放。如果不需要等比缩放  
        // 则将下面的if else语句注释即可  
        if (sx > sy)   {  
            sx = sy;  
            targetW = (int) (sx * source.getWidth());  
        }  else   {  
            sy = sx;  
            targetH = (int) (sy * source.getHeight());  
        }  
        
        // handmade  
        if (type == BufferedImage.TYPE_CUSTOM)   { 
            ColorModel cm = source.getColorModel();  
            WritableRaster raster = cm.createCompatibleWritableRaster(targetW,   targetH);  
            boolean alphaPremultiplied = cm.isAlphaPremultiplied();  
            target = new BufferedImage(cm, raster, alphaPremultiplied, null);  
        }   else  {  
            //固定宽高，宽高一定要比原图片大  
            //target = new BufferedImage(targetW, targetH, type);  
            target = new BufferedImage(100, 100, type);  
        }  
          
        Graphics2D g = target.createGraphics();  
          
        //写入背景  
        g.drawImage(ImageIO.read(new File("ok/blank.png")), 0, 0, null);  
          
        // smoother than exlax:  
        g.setRenderingHint(RenderingHints.KEY_RENDERING,  RenderingHints.VALUE_RENDER_QUALITY);  
        g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));  
        g.dispose();  
        return target;  
    }  
    
	/**
	 * 获取字节流图片
	 * @param response
	 * @param request
	 * @param uid
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getimgbyte", method = RequestMethod.GET , produces = MediaType.APPLICATION_JSON_VALUE)
	public Object getimgByte(HttpServletResponse response,
			HttpServletRequest request, @RequestParam(value = "uid") String uid)
			throws IOException {
		
		Properties pro = PropertiesLoader.loadProperties("resource.properties");
		String m_host = pro.getProperty("ImageHost");
		String base_path = pro.getProperty("base.path");

		String uri = base_path + m_host + "/" + uid + ".png";
		System.out.println("-------"+uri);
		
		URL url = null;
		url = new URL(uri);
		
		BufferedInputStream bis = null;
		HttpURLConnection httpUrl = null;

		httpUrl = (HttpURLConnection) url.openConnection();
		httpUrl.connect();
		bis = new BufferedInputStream(httpUrl.getInputStream());
		System.out.println(bis.available());
		byte[] buf = new byte[1024*1024*30];
		bis.read(buf);
	
		
		bis.close();
		httpUrl.disconnect();

		return new ResponseEntity<Object>(buf, HttpStatus.OK);
	}
	
	/**
	 * 获取图片
	 * @param response
	 * @param request
	 * @param uid
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getimg", method = RequestMethod.GET , produces = MediaType.APPLICATION_JSON_VALUE)
	public Object getimg(HttpServletResponse response,
			HttpServletRequest request, @RequestParam(value = "uid") String uid)
			throws IOException {
		
		Properties pro = PropertiesLoader.loadProperties("resource.properties");
		String m_host = pro.getProperty("ImageHost");
		String base_path = pro.getProperty("base.path");

		String uri = base_path + m_host + "/" + uid + ".png";
		System.out.println("-------"+uri);
		
		if(!isNetFileAvailable(uri)){
			uri=base_path + m_host + "/0.png";
		}
//		URL url = null;
//		url = new URL(uri);
//		
//		BufferedInputStream bis = null;
//		HttpURLConnection httpUrl = null;
//
//		httpUrl = (HttpURLConnection) url.openConnection();
//		httpUrl.connect();
//		bis = new BufferedInputStream(httpUrl.getInputStream());
//		System.out.println(bis.available());
//		byte[] buf = new byte[1024*1024*30];
//		bis.read(buf);
//		
//		bis.close();
//		httpUrl.disconnect();

		return new ResponseEntity<Object>(uri, HttpStatus.OK);
	}
	
	/**
	 * 文件是否存在
	 * @param strUrl
	 * @return
	 */
	public static boolean isNetFileAvailable(String strUrl) {
		InputStream netFileInputStream = null;
		try {
			URL url = new URL(strUrl);
			URLConnection urlConn = url.openConnection();
			netFileInputStream = urlConn.getInputStream();
			if (null != netFileInputStream) {
				return true;
			} else {
				return false;
			}
		} catch (IOException e) {
			return false;
		} finally {
			try {
				if (netFileInputStream != null)
					netFileInputStream.close();
			} catch (IOException e) {
			}
		}
	}
}
